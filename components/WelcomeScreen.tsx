
import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { Utensils, Calendar, Coffee, Film, Music, XCircle, Gamepad2, Sparkles } from 'lucide-react';

interface WelcomeScreenProps {
  onSuggestionClick: (text: string) => void;
}

const SUGGESTIONS = [
  { text: "今天中午吃什么？", icon: Utensils },
  { text: "周末做点什么有意义的事？", icon: Calendar },
  { text: "很无聊该如何打发时间？", icon: Gamepad2 },
  { text: "上班如何痛痛快快的摸鱼？", icon: Coffee },
  { text: "推荐一首适合发呆听的歌", icon: Music },
  { text: "如何优雅地拒绝不想去的聚会", icon: XCircle },
  { text: "最近有什么好康的电影或剧集", icon: Film },
  { text: "想要一杯特别的奶茶搭配", icon: Sparkles }
];

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onSuggestionClick }) => {
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 5) return "夜深了，还在思考吗？";
    if (hour < 9) return "早上好，开启新的一天吧。";
    if (hour < 12) return "上午好，今天有什么计划？";
    if (hour < 14) return "中午好，休息一下聊聊天？";
    if (hour < 18) return "下午好，捕捉一些新灵感？";
    return "晚上好，今天过得怎么样？";
  }, []);

  const suggestions = useMemo(() => {
    const shuffled = [...SUGGESTIONS].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 4);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center justify-center h-full pb-20 px-4 text-center"
    >
      <motion.h2 
        initial={{ opacity: 0, filter: 'blur(10px)' }}
        animate={{ opacity: 1, filter: 'blur(0px)' }}
        transition={{ duration: 1, delay: 0.1 }}
        className="text-3xl md:text-4xl font-medium text-transparent bg-clip-text bg-gradient-to-b from-gray-900 to-gray-600 dark:from-white dark:to-white/60 mb-4 font-serif tracking-wide"
      >
        {greeting}
      </motion.h2>
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="text-gray-500 dark:text-[#888] mb-12 text-sm font-light tracking-wide"
      >
        随时准备为您提供协助、解答疑惑或激发创意。
      </motion.p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
          {suggestions.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.button 
                key={i} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                onClick={() => onSuggestionClick(item.text)} 
                className="group relative bg-white dark:bg-white/[0.02] hover:bg-gray-50 dark:hover:bg-white/[0.04] p-5 rounded-2xl text-left transition-all duration-300 border border-black/5 dark:border-white/[0.05] hover:border-black/10 dark:hover:border-white/[0.1] shadow-sm hover:shadow-md dark:hover:shadow-[0_0_30px_rgba(255,255,255,0.03)] active:scale-[0.98] overflow-hidden flex items-center gap-4"
              >
                  <div className="absolute inset-0 bg-gradient-to-r from-black/[0.01] dark:from-white/[0.01] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="p-2 rounded-xl bg-black/[0.05] dark:bg-white/[0.05] text-gray-600 dark:text-[#888] group-hover:text-black dark:group-hover:text-white transition-colors duration-300">
                    <Icon size={18} strokeWidth={1.5} />
                  </div>
                  <span className="text-sm text-gray-600 dark:text-[#aaa] group-hover:text-black dark:group-hover:text-white transition-colors duration-300 leading-relaxed font-medium">
                    {item.text}
                  </span>
              </motion.button>
            );
          })}
      </div>
    </motion.div>
  );
};

export default WelcomeScreen;
