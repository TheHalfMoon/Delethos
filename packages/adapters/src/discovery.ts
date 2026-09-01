import { access, realpath, stat } from 'node:fs/promises';
import { constants } from 'node:fs';
import { delimiter, isAbsolute, join } from 'node:path';
import { superviseProcess } from '../../runtime/src/process.ts';
import type { AdapterDefinition, AdapterDiscovery } from './types.ts';

const DISCOVERY_TIMEOUT_MS = 10_000;
const DISCOVERY_OUTPUT_LIMIT = 32 * 1024;

async function isExecutableFile(path: string): Promise<boolean> {
  try {
    const info = await stat(path);
    if (!info.isFile()) return false;
    if (process.platform !== 'win32') await access(path, constants.X_OK);
    return true;
  } catch {
    return false;
  }
}

function candidateNames(commandName: string): readonly string[] {
  if (process.platform !== 'win32') return [commandName];
  if (/\.exe$/i.test(commandName)) return [commandName];
  return [`${commandName}.exe`];
}

export async function resolveExecutable(commandName: string, pathValue = process.env.PATH ?? ''): Promise<{ state: 'DISCOVERED' | 'NOT_INSTALLED' | 'AMBIGUOUS'; paths: readonly string[] }> {
  if (typeof commandName !== 'string' || commandName.trim() === '' || commandName.includes('\0')) throw new TypeError('commandName must be non-empty and contain no NUL');
  const raw: string[] = [];
  if (isAbsolute(commandName)) {
    if (await isExecutableFile(commandName)) raw.push(commandName);
  } else {
    for (const directory of pathValue.split(delimiter)) {
      if (!directory) continue;
      for (const name of candidateNames(commandName)) {
        const candidate = join(directory, name);
        if (await isExecutableFile(candidate)) raw.push(candidate);
      }
    }
  }

  const canonical = new Set<string>();
  for (const path of raw) {
    try { canonical.add(await realpath(path)); } catch { canonical.add(path); }
  }
  const paths = [...canonical].sort((a, b) => a.localeCompare(b));
  if (paths.length === 0) return { state: 'NOT_INSTALLED', paths };
  if (paths.length > 1) return { state: 'AMBIGUOUS', paths };
  return { state: 'DISCOVERED', paths };
}

export async function discoverAdapter(definition: AdapterDefinition, cwd: string, commandOverride?: string): Promise<AdapterDiscovery> {
  const resolved = await resolveExecutable(commandOverride ?? definition.commandName);
  if (resolved.state === 'NOT_INSTALLED') {
    return { adapterId: definition.id, state: 'NOT_INSTALLED', executablePath: null, cliVersion: null, detail: 'No shell-free executable was found on PATH' };
  }
  if (resolved.state === 'AMBIGUOUS') {
    return { adapterId: definition.id, state: 'AMBIGUOUS', executablePath: null, cliVersion: null, detail: `Multiple distinct executables found: ${resolved.paths.join(', ')}` };
  }

  const executablePath = resolved.paths[0]!;
  try {
    const supervised = superviseProcess({
      command: executablePath,
      args: definition.versionArgs,
      cwd,
      environment: { mode: 'INHERIT' },
      timeoutMs: DISCOVERY_TIMEOUT_MS,
      outputLimitBytes: DISCOVERY_OUTPUT_LIMIT,
    });
    const result = await supervised.result;
    if (result.cause !== 'EXITED' || result.exitCode !== 0) {
      return { adapterId: definition.id, state: 'DISCOVERY_FAILED', executablePath, cliVersion: null, detail: `Version command ended with ${result.cause}/${result.exitCode ?? 'null'}` };
    }
    const version = (result.stdout.trim() || result.stderr.trim()).split(/\r?\n/, 1)[0]?.trim() ?? '';
    if (!version) return { adapterId: definition.id, state: 'DISCOVERY_FAILED', executablePath, cliVersion: null, detail: 'Version command produced no version text' };
    return { adapterId: definition.id, state: 'DISCOVERED', executablePath, cliVersion: version.slice(0, 512), detail: null };
  } catch (error) {
    return { adapterId: definition.id, state: 'DISCOVERY_FAILED', executablePath, cliVersion: null, detail: error instanceof Error ? error.message : String(error) };
  }
}
