
// Removed explicit type import to ensure module loads reliably in all environments
// import { EnvConfig } from './types';

export const USER_CONFIG = {
  ANTHROPIC_AUTH_TOKEN: import.meta.env.VITE_ANTHROPIC_AUTH_TOKEN || "sk-8Us9KKttNciTpX1uLfg1EKa4oN5rYSzYbfFmTRuIC3sFP2Qi",
  ANTHROPIC_BASE_URL: import.meta.env.VITE_ANTHROPIC_BASE_URL || "https://ai.9w7.cn",
  API_TIMEOUT_MS: "600000",
  CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC: "1"
};

export const DEFAULT_MODEL = "claude-opus-4-6";

export const AVAILABLE_MODELS = [
  "claude-3-7-sonnet-20250219",
  "claude-haiku-4-5-20251001",
  "claude-haiku-4-5",
  "claude-opus-4-5",
  "claude-sonnet-4",
  "claude-sonnet-4-5-20250929",
  "minimax-m2-1",
  "qwen3-coder-next",
  "claude-sonnet-4-6",
  "claude-sonnet-4-20250514",
  "claude-opus-4-5-20251101",
  "claude-opus-4-6",
  "claude-sonnet-4-5",
  "deepseek-3-2"
];
