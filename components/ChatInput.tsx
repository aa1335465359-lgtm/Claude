
import React, { useRef, useEffect, useState } from 'react';
import { Paperclip, X, FileText, ArrowUp, ChevronDown, ChevronUp, Brain, Square, Zap, Check } from 'lucide-react';
import { Attachment, ThinkingMode } from '../types';
import { AVAILABLE_MODELS } from '../constants';

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  attachments: Attachment[];
  setAttachments: React.Dispatch<React.SetStateAction<Attachment[]>>;
  isLoading: boolean;
  onSend: () => void;
  onStop: () => void;
  currentModel: string;
  setCurrentModel: (model: string) => void;
  thinkingMode: ThinkingMode;
  setThinkingMode: (mode: ThinkingMode) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({
  input, setInput, attachments, setAttachments, isLoading, onSend, onStop,
  currentModel, setCurrentModel, thinkingMode, setThinkingMode
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isModelMenuOpen, setIsModelMenuOpen] = useState(false);
  const [isThinkingMenuOpen, setIsThinkingMenuOpen] = useState(false);
  const modelMenuRef = useRef<HTMLDivElement>(null);
  const thinkingMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modelMenuRef.current && !modelMenuRef.current.contains(event.target as Node)) {
        setIsModelMenuOpen(false);
      }
      if (thinkingMenuRef.current && !thinkingMenuRef.current.contains(event.target as Node)) {
        setIsThinkingMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  const getModelDisplayName = (model: string) => {
    if (model === 'claude-3-7-sonnet-20250219') return 'Claude 3.7 Sonnet';
    if (model === 'claude-haiku-4-5-20251001') return 'Claude Haiku 4.5 (20251001)';
    if (model === 'claude-haiku-4-5') return 'Claude Haiku 4.5';
    if (model === 'claude-opus-4-5') return 'Claude Opus 4.5';
    if (model === 'claude-sonnet-4') return 'Claude Sonnet 4';
    if (model === 'claude-sonnet-4-5-20250929') return 'Claude Sonnet 4.5 (20250929)';
    if (model === 'minimax-m2-1') return 'MiniMax M2.1';
    if (model === 'qwen3-coder-next') return 'Qwen3 Coder Next';
    if (model === 'claude-sonnet-4-6') return 'Claude Sonnet 4.6';
    if (model === 'claude-sonnet-4-20250514') return 'Claude Sonnet 4 (20250514)';
    if (model === 'claude-opus-4-5-20251101') return 'Claude Opus 4.5 (20251101)';
    if (model === 'claude-opus-4-6') return 'Claude Opus 4.6';
    if (model === 'claude-sonnet-4-5') return 'Claude Sonnet 4.5';
    if (model === 'deepseek-3-2') return 'DeepSeek 3.2';
    
    if (model.includes('opus-4-6')) return 'Opus 4.6';
    if (model.includes('opus-4-5')) return 'Opus 4.5';
    if (model.includes('sonnet-4-5')) return 'Sonnet 4.5';
    if (model.includes('3-7-sonnet')) return 'Sonnet 3.7';
    if (model.includes('haiku-4-5')) return 'Haiku 4.5';
    if (model.includes('sonnet')) return 'Sonnet';
    return model;
  };

  const processFile = async (file: File): Promise<Attachment | null> => {
      if (file.size > 5 * 1024 * 1024) {
          alert(`文件 ${file.name} 太大了。最大支持 5MB。`);
          return null;
      }
      try {
        if (file.type.startsWith('image/')) {
          const base64 = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
          return {
            type: 'image',
            name: file.name,
            data: base64.split(',')[1],
            mediaType: file.type
          };
        } else {
          const text = await new Promise<string>((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result as string);
              reader.onerror = reject;
              reader.readAsText(file);
          });
          return { type: 'text', name: file.name, data: text };
        }
      } catch (error) {
          console.error("Error reading file:", error);
          return null;
      }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newAttachments: Attachment[] = [];
      for (let i = 0; i < e.target.files.length; i++) {
        const att = await processFile(e.target.files[i]);
        if (att) newAttachments.push(att);
      }
      setAttachments(prev => [...prev, ...newAttachments]);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handlePaste = async (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    const newAttachments: Attachment[] = [];
    
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.kind === 'file') {
        const file = item.getAsFile();
        if (file) {
          e.preventDefault(); 
          const att = await processFile(file);
          if (att) newAttachments.push(att);
        }
      }
    }
    
    if (newAttachments.length > 0) {
      setAttachments(prev => [...prev, ...newAttachments]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="w-full px-4 shrink-0 z-10">
        <div className="max-w-3xl mx-auto">
            <div className={`bg-white dark:bg-[#111] border rounded-3xl shadow-xl dark:shadow-2xl transition-all duration-300 relative flex flex-col ${isLoading ? 'border-black/5 dark:border-white/[0.05]' : 'border-black/10 dark:border-white/[0.08] focus-within:border-black/20 dark:focus-within:border-white/[0.2] focus-within:bg-gray-50 dark:focus-within:bg-[#151515] hover:border-black/15 dark:hover:border-white/[0.15]'}`}>
            
            {attachments.length > 0 && (
                <div className="flex gap-3 px-4 pt-4 overflow-x-auto">
                    {attachments.map((att, index) => (
                        <div key={index} className="relative group flex-shrink-0 bg-black/5 dark:bg-black/40 border border-black/10 dark:border-white/10 rounded-xl p-2 w-16 h-16 flex flex-col items-center justify-center backdrop-blur-sm transition-all hover:border-black/20 dark:hover:border-white/20">
                                <button onClick={() => removeAttachment(index)} className="absolute -top-2 -right-2 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all hover:bg-gray-100 dark:hover:bg-neutral-700 hover:scale-110 shadow-lg border border-black/10 dark:border-white/10"><X size={12} /></button>
                                {att.type === 'image' ? <img src={`data:${att.mediaType};base64,${att.data}`} className="w-full h-full object-cover rounded-lg" alt="att" /> : <FileText className="text-gray-400 dark:text-neutral-400" size={24} strokeWidth={1.5} />}
                        </div>
                    ))}
                </div>
            )}

            <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                onPaste={handlePaste}
                placeholder="发送消息..."
                className="w-full bg-transparent text-gray-900 dark:text-[#ececec] text-[15px] px-5 pt-4 pb-16 min-h-[56px] max-h-[300px] resize-none focus:outline-none placeholder-gray-400 dark:placeholder-[#666] leading-relaxed"
                rows={1}
            />
            
            <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-3 pb-3 select-none">
                <div className="flex items-center gap-1">
                    <input type="file" ref={fileInputRef} className="hidden" multiple onChange={handleFileSelect} accept="image/*,.txt,.md,.js,.ts,.json" />
                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="p-2 text-gray-500 dark:text-[#888] hover:text-gray-900 dark:hover:text-[#ececec] hover:bg-black/5 dark:hover:bg-white/10 rounded-xl transition-all flex items-center gap-2 group"
                        title="添加附件"
                    >
                        <Paperclip size={18} strokeWidth={1.5} />
                    </button>
                </div>

                <div className="flex items-center gap-2">
                        {(currentModel.includes('sonnet') || currentModel.includes('opus')) && (
                            <div className="relative" ref={thinkingMenuRef}>
                            <button
                                onClick={() => setIsThinkingMenuOpen(!isThinkingMenuOpen)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all text-xs font-medium border ${thinkingMode === 'deep' ? 'bg-purple-100 dark:bg-purple-500/10 text-purple-600 dark:text-purple-300 border-purple-200 dark:border-purple-500/20' : 'border-transparent hover:bg-black/5 dark:hover:bg-white/10 text-gray-500 dark:text-[#999]'}`}
                            >
                                {thinkingMode === 'deep' ? <Brain size={14} strokeWidth={1.5} /> : <Zap size={14} strokeWidth={1.5} />}
                                <span>{thinkingMode === 'deep' ? '深度思考' : '快速模式'}</span>
                            </button>
                            
                            {isThinkingMenuOpen && (
                                <div className="absolute bottom-full right-0 mb-2 w-48 bg-white/95 dark:bg-[#1a1a1a]/95 backdrop-blur-xl border border-black/10 dark:border-white/10 rounded-2xl shadow-2xl py-1 z-30 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                    <button
                                        onClick={() => { setThinkingMode('adaptive'); setIsThinkingMenuOpen(false); }}
                                        className="w-full text-left px-4 py-3 text-sm flex items-center gap-3 hover:bg-black/5 dark:hover:bg-white/5 text-gray-700 dark:text-[#ccc] transition-colors"
                                    >
                                        <div className="flex flex-col">
                                            <span className="font-medium text-gray-900 dark:text-white">快速模式</span>
                                            <span className="text-[10px] text-gray-500 dark:text-[#777] mt-0.5">快速响应，适合日常</span>
                                        </div>
                                        {thinkingMode === 'adaptive' && <Check size={14} className="ml-auto text-gray-900 dark:text-white" />}
                                    </button>
                                    <button
                                        onClick={() => { setThinkingMode('deep'); setIsThinkingMenuOpen(false); }}
                                        className="w-full text-left px-4 py-3 text-sm flex items-center gap-3 hover:bg-black/5 dark:hover:bg-white/5 text-gray-700 dark:text-[#ccc] transition-colors"
                                    >
                                        <div className="flex flex-col">
                                            <span className="font-medium text-gray-900 dark:text-white">深度思考</span>
                                            <span className="text-[10px] text-gray-500 dark:text-[#777] mt-0.5">更强推理，适合复杂问题</span>
                                        </div>
                                        {thinkingMode === 'deep' && <Check size={14} className="ml-auto text-gray-900 dark:text-white" />}
                                    </button>
                                </div>
                            )}
                            </div>
                        )}

                    <div className="relative" ref={modelMenuRef}>
                        <button 
                            onClick={() => setIsModelMenuOpen(!isModelMenuOpen)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all text-xs font-medium border border-transparent ${isModelMenuOpen ? 'bg-black/5 dark:bg-white/10 text-gray-900 dark:text-[#ececec]' : 'hover:bg-black/5 dark:hover:bg-white/10 text-gray-500 dark:text-[#999] hover:text-gray-900 dark:hover:text-[#ececec]'}`}
                        >
                            {getModelDisplayName(currentModel)}
                            {isModelMenuOpen ? <ChevronUp size={14} strokeWidth={1.5} /> : <ChevronDown size={14} strokeWidth={1.5} />}
                        </button>

                        {isModelMenuOpen && (
                            <div className="absolute bottom-full right-0 mb-2 w-56 bg-white/95 dark:bg-[#1a1a1a]/95 backdrop-blur-xl border border-black/10 dark:border-white/10 rounded-2xl shadow-2xl py-2 z-30 max-h-72 overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
                                <div className="px-4 py-2 text-[10px] font-bold text-gray-500 dark:text-[#666] uppercase tracking-wider">选择模型</div>
                                {AVAILABLE_MODELS.map((model) => {
                                    const isSelected = currentModel === model;
                                    return (
                                        <button
                                            key={model}
                                            onClick={() => {
                                                setCurrentModel(model);
                                                setIsModelMenuOpen(false);
                                            }}
                                            className={`w-full text-left px-4 py-2.5 text-sm flex items-center justify-between hover:bg-black/5 dark:hover:bg-white/5 transition-colors ${isSelected ? 'text-gray-900 dark:text-white bg-black/5 dark:bg-white/5 font-medium' : 'text-gray-600 dark:text-[#bbb]'}`}
                                        >
                                            <span className="truncate">{getModelDisplayName(model)}</span>
                                            {isSelected && <Check size={14} className="text-gray-900 dark:text-white" />}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <button
                        onClick={isLoading ? onStop : onSend}
                        disabled={!isLoading && !input.trim() && attachments.length === 0}
                        className={`p-2 rounded-xl transition-all duration-300 flex items-center justify-center ${
                            isLoading 
                            ? 'bg-black/10 dark:bg-white/10 text-gray-600 dark:text-[#ccc] hover:bg-black/20 dark:hover:bg-white/20 animate-pulse'
                            : (input.trim() || attachments.length > 0)
                                ? 'bg-black dark:bg-white text-white dark:text-black shadow-[0_0_15px_rgba(0,0,0,0.1)] dark:shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:shadow-[0_0_25px_rgba(0,0,0,0.2)] dark:hover:shadow-[0_0_25px_rgba(255,255,255,0.5)] hover:scale-105' 
                                : 'bg-black/5 dark:bg-white/5 text-gray-400 dark:text-[#666] cursor-not-allowed'
                        }`}
                    >
                        {isLoading ? <Square size={18} fill="currentColor" /> : <ArrowUp size={18} strokeWidth={2.5} />}
                    </button>
                </div>
            </div>
            </div>
            
            <div className="text-center mt-4">
                <p className="text-[11px] text-gray-400 dark:text-[#555] select-none font-medium">AI 可能会犯错。请务必核实重要信息。</p>
            </div>
        </div>
    </div>
  );
};

export default ChatInput;
