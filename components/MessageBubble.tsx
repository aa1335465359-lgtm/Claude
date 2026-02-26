
import React, { useState } from 'react';
import { Message, Role } from '../types';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check, CheckCircle2, BrainCircuit, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MessageBubbleProps {
  message: Message;
}

const ThinkingBlock: React.FC<{ content: string, isGenerating?: boolean }> = ({ content, isGenerating }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="my-5 border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/[0.02] rounded-2xl overflow-hidden backdrop-blur-sm">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-black/5 dark:hover:bg-white/[0.02] transition-colors text-xs text-gray-500 dark:text-[#999] font-medium select-none text-left"
            >
                <BrainCircuit size={16} className={`text-purple-500 dark:text-purple-400 ${isGenerating ? 'animate-pulse' : ''}`} strokeWidth={1.5} />
                <span className="tracking-wide whitespace-nowrap text-gray-600 dark:text-gray-400">
                    {isGenerating ? '正在深度思考...' : '已完成思考'}
                </span>
                {!isOpen && content && (
                    <span className="text-gray-400 dark:text-[#666] truncate flex-1 ml-2 text-[11px] font-serif italic opacity-70">
                        {content.slice(-60).replace(/\n/g, ' ')}
                    </span>
                )}
                <span className={`ml-auto transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''} text-gray-400 dark:text-gray-500`}>
                    <ChevronDown size={14} strokeWidth={1.5} />
                </span>
            </button>
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                    >
                        <div className="p-4 text-gray-600 dark:text-[#888] text-sm italic leading-relaxed bg-black/5 dark:bg-black/20 font-serif border-t border-black/5 dark:border-white/5 whitespace-pre-wrap">
                            {content}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const CodeBlock = ({ language, children }: { language: string, children: string }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(children);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="my-6 rounded-2xl overflow-hidden border border-black/10 dark:border-white/10 shadow-xl dark:shadow-2xl group bg-[#f8f9fa] dark:bg-[#0d0d0d]">
            <div className="bg-black/5 dark:bg-white/[0.03] px-4 py-2.5 text-xs text-gray-500 dark:text-[#888] border-b border-black/5 dark:border-white/5 font-mono flex justify-between items-center select-none backdrop-blur-md">
                <span className="font-medium text-gray-700 dark:text-[#ccc] tracking-wider uppercase">{language}</span>
                <button 
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 text-gray-500 dark:text-[#666] hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                    {copied ? (
                        <>
                            <CheckCircle2 size={14} className="text-green-500 dark:text-green-400" strokeWidth={1.5} />
                            <span className="text-green-500 dark:text-green-400">已复制</span>
                        </>
                    ) : (
                        <>
                            <Copy size={14} strokeWidth={1.5} />
                            <span>复制</span>
                        </>
                    )}
                </button>
            </div>
            <SyntaxHighlighter
                style={vscDarkPlus}
                language={language}
                PreTag="div"
                customStyle={{ margin: 0, borderRadius: 0, background: 'transparent', padding: '1.25rem', fontSize: '0.875rem', lineHeight: '1.6' }}
                showLineNumbers={true}
            >
                {children}
            </SyntaxHighlighter>
        </div>
    );
};

const MarkdownRenderer = React.memo(({ content }: { content: string }) => (
  <ReactMarkdown
    remarkPlugins={[remarkGfm]}
    components={{
      h1: ({children}) => <h1 className="text-2xl font-semibold text-gray-900 dark:text-[#ececec] mt-8 mb-4 font-sans tracking-tight">{children}</h1>,
      h2: ({children}) => <h2 className="text-xl font-semibold text-gray-900 dark:text-[#ececec] mt-6 mb-3 font-sans tracking-tight">{children}</h2>,
      h3: ({children}) => <h3 className="text-lg font-medium text-gray-900 dark:text-[#ececec] mt-4 mb-2 font-sans">{children}</h3>,
      p: ({children}) => <p className="mb-4 leading-relaxed text-gray-700 dark:text-[#ccc] last:mb-0">{children}</p>,
      ul: ({children}) => <ul className="list-disc pl-6 mb-4 space-y-1.5 text-gray-700 dark:text-[#ccc] marker:text-gray-400 dark:marker:text-[#666]">{children}</ul>,
      ol: ({children}) => <ol className="list-decimal pl-6 mb-4 space-y-1.5 text-gray-700 dark:text-[#ccc] marker:text-gray-400 dark:marker:text-[#666]">{children}</ol>,
      li: ({children}) => <li className="pl-1 mb-1">{children}</li>,
      blockquote: ({children}) => (
          <blockquote className="border-l-2 border-black/20 dark:border-white/20 pl-4 py-1 my-5 text-gray-500 dark:text-[#888] italic bg-black/5 dark:bg-white/[0.02] rounded-r-lg">
            {children}
          </blockquote>
      ),
      strong: ({children}) => <strong className="font-semibold text-black dark:text-white">{children}</strong>,
      a: ({children, href}) => <a href={href} className="text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 hover:underline decoration-1 underline-offset-4 transition-colors" target="_blank" rel="noopener noreferrer">{children}</a>,
      hr: () => <hr className="border-black/10 dark:border-white/10 my-8" />,
      table: ({children}) => (
        <div className="overflow-hidden my-6 border border-black/10 dark:border-white/10 rounded-xl shadow-sm bg-black/5 dark:bg-white/[0.02]">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-black/10 dark:divide-white/10">{children}</table>
            </div>
        </div>
      ),
      thead: ({children}) => <thead className="bg-black/5 dark:bg-white/[0.03]">{children}</thead>,
      th: ({children}) => <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 dark:text-[#ececec] uppercase tracking-wider border-b border-black/10 dark:border-white/10">{children}</th>,
      td: ({children}) => <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-[#ccc] border-b border-black/5 dark:border-white/5 last:border-0">{children}</td>,
      code({node, inline, className, children, ...props}: any) {
        const match = /language-(\w+)/.exec(className || '')
        return !inline && match ? (
            <CodeBlock language={match[1]} children={String(children).replace(/\n$/, '')} />
        ) : (
          <code {...props} className={`${className} bg-black/5 dark:bg-white/10 rounded-md px-1.5 py-0.5 text-gray-900 dark:text-[#ececec] font-mono text-[0.85em] border border-black/5 dark:border-white/5`}>
            {children}
          </code>
        )
      }
    }}
  >
    {content}
  </ReactMarkdown>
));

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === Role.User;
  const isError = message.isError;
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    let textToCopy = '';
    if (typeof message.content === 'string') {
        const rawContent = message.content;
        
        // Remove all completed thinking blocks
        textToCopy = rawContent.replace(/___THINKING_START___[\s\S]*?___THINKING_END___/g, '');
        // Remove any incomplete thinking block at the end
        textToCopy = textToCopy.replace(/___THINKING_START___[\s\S]*$/, '');
        
        textToCopy = textToCopy.trim();
    } else if (Array.isArray(message.content)) {
        textToCopy = message.content
            .map(block => block.type === 'text' ? block.text : '')
            .join('\n')
            .trim();
    }

    if (textToCopy) {
        await navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }
  };

  const renderContent = () => {
    if (typeof message.content === 'string') {
        if (isUser) {
             return <div className="whitespace-pre-wrap text-gray-900 dark:text-[#ececec] font-sans">{message.content}</div>;
        }

        if (!message.content) {
            return (
                <div className="flex items-center gap-2 text-gray-400 dark:text-[#666] text-sm h-7">
                  <div className="flex gap-1.5 items-center">
                    <span className="w-1.5 h-1.5 bg-gray-400 dark:bg-[#666] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-gray-400 dark:bg-[#666] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-gray-400 dark:bg-[#666] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
            );
        }

        const rawContent = message.content;
        const thinkingStartTag = '___THINKING_START___';
        const thinkingEndTag = '___THINKING_END___';

        const startIndex = rawContent.indexOf(thinkingStartTag);
        
        if (startIndex !== -1) {
            const endIndex = rawContent.indexOf(thinkingEndTag);
            let thinkingContent = '';
            let mainContent = '';
            let isGeneratingThinking = false;

            if (endIndex !== -1) {
                thinkingContent = rawContent.substring(startIndex + thinkingStartTag.length, endIndex);
                mainContent = rawContent.substring(0, startIndex) + rawContent.substring(endIndex + thinkingEndTag.length);
            } else {
                thinkingContent = rawContent.substring(startIndex + thinkingStartTag.length);
                mainContent = rawContent.substring(0, startIndex);
                isGeneratingThinking = true;
            }

            return (
                <div>
                    <ThinkingBlock content={thinkingContent} isGenerating={isGeneratingThinking} />
                    {mainContent && <MarkdownRenderer content={mainContent} />}
                </div>
            );
        }
        return <MarkdownRenderer content={rawContent} />;
    }

    if (Array.isArray(message.content)) {
        return (
            <div className="flex flex-col gap-4">
                {message.content.map((block, idx) => {
                    if (block.type === 'image' && block.source) {
                        return (
                            <div key={idx} className="rounded-2xl overflow-hidden border border-white/10 bg-black/50 max-w-sm shadow-lg">
                                <img 
                                    src={`data:${block.source.media_type};base64,${block.source.data}`} 
                                    alt="Uploaded" 
                                    className="w-full h-auto"
                                />
                            </div>
                        );
                    }
                    if (block.type === 'text' && block.text) {
                        return isUser ? 
                            <div key={idx} className="whitespace-pre-wrap text-gray-900 dark:text-[#ececec] font-sans">{block.text}</div> : 
                            <MarkdownRenderer key={idx} content={block.text} />;
                    }
                    return null;
                })}
            </div>
        );
    }
    return null;
  };

  const optimizationStyle = {
      contentVisibility: 'auto' as any,
      containIntrinsicSize: isUser ? '0 80px' : '0 200px',
      contain: 'layout paint style'
  };

  if (isUser) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex w-full mb-8 justify-end"
        style={optimizationStyle}
      >
        <div className="bg-[#f4f4f4] dark:bg-white/10 backdrop-blur-md border border-black/5 dark:border-white/5 text-gray-900 dark:text-[#ececec] rounded-3xl rounded-tr-sm px-6 py-3.5 max-w-[85%] md:max-w-[75%] shadow-sm">
          <div className="text-[15px] leading-relaxed break-words">
             {renderContent()}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex w-full mb-10 justify-start group"
        style={optimizationStyle}
    >
      <div className="flex-1 max-w-3xl min-w-0 relative">
        <div className={`
            prose dark:prose-invert max-w-none text-[16px] leading-7 font-serif relative z-10 bg-transparent
            ${isError ? 'text-red-500 dark:text-red-300 bg-red-50 dark:bg-red-900/20 p-5 rounded-2xl border border-red-200 dark:border-red-500/30 font-sans backdrop-blur-sm' : ''}
        `}>
           {isUser ? null : <div className="font-semibold text-gray-900 dark:text-[#ececec] text-sm mb-3 font-sans flex items-center gap-2 tracking-wide">AI</div>}
           {renderContent()}
        </div>

        {!isUser && (
            <div className="mt-2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 relative z-20">
                <button 
                    onClick={handleCopy}
                    className="p-1.5 px-2 text-gray-500 dark:text-[#666] hover:text-gray-900 dark:hover:text-[#ececec] hover:bg-black/5 dark:hover:bg-white/10 rounded-lg transition-all flex items-center gap-1.5 text-xs font-sans"
                    title="复制全文"
                >
                    {copied ? (
                        <>
                            <Check size={14} className="text-green-500 dark:text-green-400" strokeWidth={1.5} />
                            <span className="text-green-500 dark:text-green-400">已复制</span>
                        </>
                    ) : (
                        <>
                            <Copy size={14} strokeWidth={1.5} />
                            <span>复制</span>
                        </>
                    )}
                </button>
            </div>
        )}
      </div>
    </motion.div>
  );
};

export default React.memo(MessageBubble, (prev, next) => {
    return (
        prev.message.id === next.message.id && 
        prev.message.content === next.message.content && 
        prev.message.isError === next.message.isError
    );
});
