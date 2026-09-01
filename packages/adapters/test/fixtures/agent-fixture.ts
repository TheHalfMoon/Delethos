const mode = process.argv[2] ?? 'noop';

switch (mode) {
  case 'codex-success':
    process.stdout.write(`${JSON.stringify({ type: 'thread.started', thread_id: 'fixture-thread' })}\n`);
    process.stdout.write(`${JSON.stringify({ type: 'item.completed', item: { type: 'agent_message', text: 'fixture ok' } })}\n`);
    process.stdout.write(`${JSON.stringify({ type: 'turn.completed' })}\n`);
    break;
  case 'codex-failure':
    process.stdout.write(`${JSON.stringify({ type: 'turn.failed', error: { message: 'fixture provider failure' } })}\n`);
    process.exitCode = 1;
    break;
  case 'claude-success':
    process.stdout.write(JSON.stringify({ type: 'result', subtype: 'success', is_error: false, result: 'fixture ok', session_id: 'fixture-session' }));
    break;
  case 'claude-failure':
    process.stdout.write(JSON.stringify({ type: 'result', subtype: 'error', is_error: true, result: 'fixture failed' }));
    process.exitCode = 1;
    break;
  case 'malformed':
    process.stdout.write('{not-json');
    break;
  case 'large':
    process.stdout.write('x'.repeat(2 * 1024 * 1024));
    break;
  case 'sleep':
    setTimeout(() => process.stdout.write('done'), 60_000);
    break;
  case 'pulse-then-stall':
    process.stdout.write('pulse');
    setTimeout(() => {}, 60_000);
    break;
  case 'echo-cwd':
    process.stdout.write(process.cwd());
    break;
  default:
    process.stdout.write('noop');
}
