export {
  GitCommandError,
  discoverFilterDrivers,
  filterSuppressionConfig,
  inspectRepository,
  runGit,
  type GitResult,
  type RepositoryFacts,
} from './git.ts';

export {
  WorktreeRecoveryError,
  cleanupOwnedWorktree,
  discoverOwnedWorktrees,
  inspectWorktreeState,
  listWorktrees,
  parseWorktreePorcelainZ,
  prepareWorktree,
  type CleanupResult,
  type PreparedWorktree,
  type WorktreeEntry,
  type WorktreeState,
} from './worktree.ts';

export {
  superviseProcess,
  type CleanupStatus,
  type ProcessEnvironment,
  type ProcessRequest,
  type ProcessResult,
  type ProcessTerminalCause,
  type SupervisedProcess,
  type TerminationStrategy,
} from './process.ts';
