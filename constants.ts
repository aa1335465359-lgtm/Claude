
// Removed explicit type import to ensure module loads reliably in all environments
// import { EnvConfig } from './types';

export const USER_CONFIG = {
  ANTHROPIC_AUTH_TOKEN: import.meta.env.VITE_ANTHROPIC_AUTH_TOKEN || "sk-8Us9KKttNciTpX1uLfg1EKa4oN5rYSzYbfFmTRuIC3sFP2Qi",
  ANTHROPIC_BASE_URL: import.meta.env.VITE_ANTHROPIC_BASE_URL || "https://ai.9w7.cn",
  API_TIMEOUT_MS: "600000",
  CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC: "1"
};

export const DEFAULT_MODEL = "gpt-5.2";

export const AVAILABLE_MODELS = [
  "gpt-5.3-codex",
  "gpt-5.2",
  "claude-opus-4-6",
  "qwen3-coder-next",
  "minimax-m2-1",
  "claude-sonnet-4-6",
  "deepseek-3-2",
  "claude-haiku-4-5"
];
