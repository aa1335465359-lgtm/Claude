import { useState, useRef } from 'react';
import { Message, Role, ContentBlock, Attachment, ThinkingMode } from '../types';
import { streamCompletion } from '../services/anthropicService';
import { DEFAULT_MODEL } from '../constants';

export function useChat(
  currentSessionId: string | null,
  messages: Message[],
  updateCurrentSessionMessages: (newMessages: Message[], sessionId?: string) => void,
  setSessions: any,
  createNewSession: () => string
) {
  const [input, setInput] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentModel, setCurrentModel] = useState(DEFAULT_MODEL);
  const [thinkingMode, setThinkingMode] = useState<ThinkingMode>('adaptive');
  
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsLoading(false);
  };

  const handleSend = async () => {
    if (isLoading) {
        handleStop();
        return;
    }

    if (!input.trim() && attachments.length === 0) return;

    let targetSessionId = currentSessionId;
    let currentMessages = messages;

    if (!targetSessionId) {
        targetSessionId = createNewSession();
        currentMessages = [];
    }

    let content: ContentBlock[] | string = input.trim();

    if (attachments.length > 0) {
        const blocks: ContentBlock[] = [];
        attachments.forEach(att => {
            if (att.type === 'image') {
                blocks.push({
                    type: 'image',
                    source: { type: 'base64', media_type: att.mediaType!, data: att.data }
                });
            } else if (att.type === 'text') {
                blocks.push({ type: 'text', text: `<file name="${att.name}">\n${att.data}\n</file>` });
            }
        });
        if (input.trim()) blocks.push({ type: 'text', text: input.trim() });
        content = blocks;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: Role.User,
      content: content,
      timestamp: Date.now()
    };

    const updatedHistory = [...currentMessages, userMessage];
    updateCurrentSessionMessages(updatedHistory, targetSessionId);
    setInput('');
    setAttachments([]);
    setIsLoading(true);
    
    const assistantId = (Date.now() + 1).toString();
    const historyWithPlaceholder = [...updatedHistory, {
        id: assistantId,
        role: Role.Assistant,
        content: '',
        timestamp: Date.now()
    }];
    updateCurrentSessionMessages(historyWithPlaceholder, targetSessionId);

    abortControllerRef.current = new AbortController();

    let fullContent = '';
    
    await streamCompletion(
      updatedHistory,
      currentModel, 
      thinkingMode,
      (textChunk) => {
        fullContent += textChunk;
        setSessions((prev: any) => prev.map((s: any) => {
            if (s.id === targetSessionId) {
                const newMsgs = s.messages.map((msg: any) => 
                    msg.id === assistantId ? { ...msg, content: fullContent } : msg
                );
                return { ...s, messages: newMsgs };
            }
            return s;
        }));
      },
      () => {
        setIsLoading(false);
        abortControllerRef.current = null;
      },
      (error) => {
        setSessions((prev: any) => prev.map((s: any) => {
            if (s.id === targetSessionId) {
                const newMsgs = s.messages.map((msg: any) => 
                    msg.id === assistantId ? { ...msg, content: `Error: ${error}`, isError: true } : msg
                );
                return { ...s, messages: newMsgs };
            }
            return s;
        }));
        setIsLoading(false);
        abortControllerRef.current = null;
      },
      abortControllerRef.current.signal
    );
  };

  return {
    input,
    setInput,
    attachments,
    setAttachments,
    isLoading,
    currentModel,
    setCurrentModel,
    thinkingMode,
    setThinkingMode,
    handleSend,
    handleStop
  };
}
