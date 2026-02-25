import { useState, useEffect } from 'react';
import { ChatSession, Message } from '../types';

export function useSessions() {
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    try {
      const saved = localStorage.getItem('chat_sessions');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('chat_sessions', JSON.stringify(sessions));
  }, [sessions]);

  const createNewSession = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: '新对话',
      messages: [],
      updatedAt: Date.now()
    };
    setSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
  };

  const deleteSession = (sessionId: string) => {
    setSessions(prev => {
      const newSessions = prev.filter(s => s.id !== sessionId);
      if (currentSessionId === sessionId) {
        if (newSessions.length > 0) {
          setCurrentSessionId(newSessions[0].id);
        } else {
          setTimeout(createNewSession, 0);
          setCurrentSessionId(null);
        }
      }
      return newSessions;
    });
  };

  const updateCurrentSessionMessages = (newMessages: Message[]) => {
    if (!currentSessionId) return;
    
    setSessions(prev => prev.map(s => {
      if (s.id === currentSessionId) {
        let title = s.title;
        if (s.messages.length === 0 && newMessages.length > 0) {
           const firstContent = newMessages[0].content;
           if (typeof firstContent === 'string') {
             title = firstContent.slice(0, 30) + (firstContent.length > 30 ? '...' : '');
           } else if (Array.isArray(firstContent) && firstContent[0].type === 'text') {
             title = (firstContent[0].text || '').slice(0, 30);
           }
        }
        return { ...s, messages: newMessages, title, updatedAt: Date.now() };
      }
      return s;
    }));
  };

  return {
    sessions,
    setSessions,
    currentSessionId,
    setCurrentSessionId,
    createNewSession,
    deleteSession,
    updateCurrentSessionMessages,
    currentSession: sessions.find(s => s.id === currentSessionId)
  };
}
