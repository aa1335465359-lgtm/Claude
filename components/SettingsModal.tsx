import React from 'react';
import { USER_CONFIG } from '../constants';
import { X, ShieldCheck, Server, Clock, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={onClose}
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative bg-[#111]/90 border border-white/10 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden backdrop-blur-xl"
          >
            <div className="flex items-center justify-between p-5 border-b border-white/5 bg-white/[0.02]">
              <h2 className="text-lg font-medium text-white flex items-center gap-2 tracking-wide">
                <ShieldCheck size={20} className="text-green-400" strokeWidth={1.5} />
                当前配置
              </h2>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-xl text-[#888] hover:text-white transition-all duration-200"
              >
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>
            
            <div className="p-6 space-y-5">
                <p className="text-[#888] text-sm mb-2 font-light tracking-wide">
                    此环境配置已预加载到客户端。
                </p>

                <div className="space-y-3">
                    <div className="bg-black/40 rounded-2xl p-4 border border-white/5 hover:border-white/10 transition-colors">
                        <div className="flex items-center gap-2 text-blue-400 text-xs font-mono mb-2 uppercase tracking-wider">
                            <Server size={14} strokeWidth={1.5} /> 接口地址 (BASE URL)
                        </div>
                        <div className="text-[#ececec] font-mono text-sm truncate select-all">
                            {USER_CONFIG.ANTHROPIC_BASE_URL}
                        </div>
                    </div>

                    <div className="bg-black/40 rounded-2xl p-4 border border-white/5 hover:border-white/10 transition-colors">
                        <div className="flex items-center gap-2 text-yellow-500/80 text-xs font-mono mb-2 uppercase tracking-wider">
                            <ShieldCheck size={14} strokeWidth={1.5} /> 认证令牌 (AUTH TOKEN)
                        </div>
                        <div className="text-[#ececec] font-mono text-sm truncate blur-[3px] hover:blur-none transition-all duration-300 select-all cursor-pointer">
                            {USER_CONFIG.ANTHROPIC_AUTH_TOKEN}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-black/40 rounded-2xl p-4 border border-white/5 hover:border-white/10 transition-colors">
                            <div className="flex items-center gap-2 text-purple-400 text-xs font-mono mb-2 uppercase tracking-wider">
                                <Clock size={14} strokeWidth={1.5} /> 超时时间
                            </div>
                            <div className="text-[#ececec] font-mono text-sm">
                                {USER_CONFIG.API_TIMEOUT_MS} ms
                            </div>
                        </div>
                        <div className="bg-black/40 rounded-2xl p-4 border border-white/5 hover:border-white/10 transition-colors">
                            <div className="flex items-center gap-2 text-pink-400 text-xs font-mono mb-2 uppercase tracking-wider">
                                <Zap size={14} strokeWidth={1.5} /> 流量优化
                            </div>
                            <div className="text-[#ececec] font-mono text-sm">
                                {USER_CONFIG.CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC === "1" ? "已启用" : "未启用"}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SettingsModal;