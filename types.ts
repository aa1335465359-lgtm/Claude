
export interface EnvConfig {
  ANTHROPIC_AUTH_TOKEN: string;
  ANTHROPIC_BASE_URL: string;
  API_TIMEOUT_MS: string;
  CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC: string;
}

export enum Role {
  User = 'user',
  Assistant = 'assistant'
}

export type ThinkingMode = 'adaptive' | 'deep';

export interface ContentBlock {
  type: 'text' | 'image';
  text?: string;
  source?: {
    type: 'base64';
    media_type: string;
    data: string;
  };
}

export type MessageContent = string | ContentBlock[];

export interface Message {
  id: string;
  role: Role;
  content: MessageContent;
  timestamp: number;
  isError?: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  updatedAt: number;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  input: string;
}

export interface Attachment {
  type: 'image' | 'text';
  name: string;
  data: string;
  mediaType?: string;
}

// Response types for Anthropic streaming
export interface AnthropicStreamEvent {
  type: string;
  delta?: {
    type: string;
    text?: string;
  };
  content_block?: {
    text?: string;
  };
  error?: {
    type: string;
    message: string;
  };
}
