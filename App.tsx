
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
                {isLoading && messages.length > 0 && messages[messages.length - 1].role === 'user' && (
                  <div className="flex w-full mb-10 justify-start">
                    <div className="flex-1 max-w-3xl min-w-0">
                      <div className="font-semibold text-[#ececec] text-sm mb-3 font-sans flex items-center gap-2 tracking-wide">AI</div>
                      <div className="flex items-center gap-2 text-[#888] text-sm h-7">
                        <div className="flex gap-1.5 items-center">
                          <span className="w-1.5 h-1.5 bg-[#666] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                          <span className="w-1.5 h-1.5 bg-[#666] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                          <span className="w-1.5 h-1.5 bg-[#666] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
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
  } = useChat(currentSessionId, messages, updateCurrentSessionMessages, setSessions);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const settingsClickCountRef = useRef(0);
  const settingsResetTimerRef = useRef<any>(null);

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
    <div className="flex h-screen bg-[#0a0a0a] text-[#ececec] font-sans overflow-hidden selection:bg-white/20">
      <Sidebar 
        sessions={sessions}
        currentSessionId={currentSessionId}
        onSelectSession={setCurrentSessionId}
        onDeleteSession={deleteSession}
        onNewChat={createNewSession}
      />

      <div className="flex-1 flex flex-col h-full min-w-0 relative">
        <div className="absolute top-4 right-4 z-20">
          <button 
            onClick={handleSettingsClick}
            className="p-2 text-[#999] hover:text-white rounded-xl transition-all duration-300 bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/5"
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

        <div className="z-10 bg-[#0a0a0a] pt-2 pb-6">
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
