import { useRef, useLayoutEffect, useEffect } from 'react';
import { Message } from '../types';

export function useAutoScroll(messages: Message[], isLoading: boolean, sessionId?: string | null) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isUserAtBottomRef = useRef(true);
  const prevSessionIdRef = useRef(sessionId);

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    // Increased tolerance for "at bottom" check
    const isAtBottom = scrollHeight - scrollTop - clientHeight <= 150;
    isUserAtBottomRef.current = isAtBottom;
  };

  const scrollToBottom = () => {
      if (scrollContainerRef.current) {
          const container = scrollContainerRef.current;
          container.scrollTop = container.scrollHeight;
      }
  };

  // Use layout effect for immediate updates
  useLayoutEffect(() => {
    const isSessionChanged = sessionId !== prevSessionIdRef.current;

    if (isSessionChanged) {
        isUserAtBottomRef.current = true;
    }

    if (isUserAtBottomRef.current) {
        // Use requestAnimationFrame to ensure DOM has updated
        requestAnimationFrame(() => {
            scrollToBottom();
            // Double check after a short delay for images/content that might load slightly later
            setTimeout(scrollToBottom, 50);
        });
    }

    prevSessionIdRef.current = sessionId;
  }, [messages, isLoading, sessionId]);

  // Force scroll on initial load or session change
  useEffect(() => {
      isUserAtBottomRef.current = true;
      requestAnimationFrame(scrollToBottom);
  }, [sessionId]);

  return {
    messagesEndRef,
    scrollContainerRef,
    handleScroll
  };
}
