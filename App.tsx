
import React, { useState, useRef } from 'react';
import { Message } from './types';
import MessageBubble from './components/MessageBubble';
import SettingsModal from './components/SettingsModal';
import Sidebar from './components/Sidebar';
import WelcomeScreen from './components/WelcomeScreen';
import ChatInput from './components/ChatInput';
import { Settings } from 'lucide-react';
import { useSessions } from './hooks/useSessions';
import { useChat } from './hooks/useChat';
import { useAutoScroll } from './hooks/useAutoScroll';

// === OPTIMIZED CHAT LIST COMPONENT ===
const ChatList = React.memo(({ 
    messages, 
    isLoading, 
    sessionId,
    onSuggestionClick 
}: { 
    messages: Message[], 
    isLoading: boolean, 
    sessionId: string | null,
    onSuggestionClick: (text: string) => void 
}) => {
    const { messagesEndRef, scrollContainerRef, handleScroll } = useAutoScroll(messages, isLoading, sessionId);

    return (
        <main 
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto scroll-smooth"
            style={{ transform: 'translate3d(0,0,0)' }}
        >
          <div className="max-w-3xl mx-auto w-full px-4 pt-16 pb-10 min-h-full flex flex-col">
            {messages.length === 0 ? (
              <div className="flex-1 flex flex-col justify-center">
                <WelcomeScreen onSuggestionClick={onSuggestionClick} />
              </div>
            ) : (
              <>
                {messages.map((msg) => (
                  <MessageBubble key={msg.id} message={msg} />
                ))}
              </>
            )}
             <div ref={messagesEndRef} className="h-2" />
          </div>
        </main>
    );
});

const App: React.FC = () => {
  const {
    sessions,
    setSessions,
    currentSessionId,
    setCurrentSessionId,
    createNewSession,
    deleteSession,
    updateCurrentSessionMessages,
    currentSession
  } = useSessions();

  const messages = currentSession ? currentSession.messages : [];

  const {
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
  } = useChat(currentSessionId, messages, updateCurrentSessionMessages, setSessions, createNewSession);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const settingsClickCountRef = useRef(0);
  const settingsResetTimerRef = useRef<any>(null);

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  React.useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleSettingsClick = () => {
    if (settingsResetTimerRef.current) {
      clearTimeout(settingsResetTimerRef.current);
    }
    settingsClickCountRef.current += 1;
    if (settingsClickCountRef.current >= 10) {
      setIsSettingsOpen(true);
      settingsClickCountRef.current = 0;
    } else {
      settingsResetTimerRef.current = setTimeout(() => {
        settingsClickCountRef.current = 0;
      }, 400);
    }
  };

  return (
    <div className="flex h-screen bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-[#ececec] font-sans overflow-hidden selection:bg-black/10 dark:selection:bg-white/20 transition-colors duration-300">
      <Sidebar 
        sessions={sessions}
        currentSessionId={currentSessionId}
        onSelectSession={setCurrentSessionId}
        onDeleteSession={deleteSession}
        onNewChat={createNewSession}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      <div className="flex-1 flex flex-col h-full min-w-0 relative">
        <div className="absolute top-4 right-4 z-20">
          <button 
            onClick={handleSettingsClick}
            className="p-2 text-gray-400 hover:text-gray-900 dark:text-[#999] dark:hover:text-white rounded-xl transition-all duration-300 bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10 backdrop-blur-md border border-black/5 dark:border-white/5"
          >
            <Settings size={18} />
          </button>
        </div>

        <ChatList 
            messages={messages} 
            isLoading={isLoading} 
            sessionId={currentSessionId}
            onSuggestionClick={(text) => setInput(text)} 
        />

        <div className="z-10 bg-white dark:bg-[#0a0a0a] pt-2 pb-6 transition-colors duration-300">
          <ChatInput 
            input={input}
            setInput={setInput}
            attachments={attachments}
            setAttachments={setAttachments}
            isLoading={isLoading}
            onSend={handleSend}
            onStop={handleStop}
            currentModel={currentModel}
            setCurrentModel={setCurrentModel}
            thinkingMode={thinkingMode}
            setThinkingMode={setThinkingMode}
          />
        </div>
      </div>

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
};

export default App;
