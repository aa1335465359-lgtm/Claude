
import React from 'react';
import { MessageSquarePlus, Search, LayoutTemplate, SquareTerminal, Trash2 } from 'lucide-react';
import { ChatSession } from '../types';

interface SidebarProps {
  sessions: ChatSession[];
  currentSessionId: string | null;
  onSelectSession: (id: string) => void;
  onDeleteSession: (id: string) => void;
  onNewChat: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ sessions, currentSessionId, onSelectSession, onDeleteSession, onNewChat }) => {
  const sortedSessions = [...sessions].sort((a, b) => b.updatedAt - a.updatedAt);

  return (
    <div className="w-[260px] h-full bg-[#0a0a0a] flex flex-col border-r border-white/5 text-[#ececec] flex-shrink-0 transition-all duration-300">
      <div className="p-4 flex items-center justify-between">
        <button 
          onClick={onNewChat}
          className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-sm font-medium px-4 py-2.5 rounded-xl w-full transition-all duration-200 border border-white/5 hover:border-white/10 shadow-sm"
        >
          <MessageSquarePlus size={16} strokeWidth={1.5} />
          <span>新对话</span>
        </button>
      </div>

      <div className="px-3 py-2 space-y-1">
        <div className="flex items-center gap-3 px-3 py-2 text-sm text-[#888] hover:bg-white/5 hover:text-white rounded-xl cursor-pointer transition-all duration-200">
          <Search size={16} strokeWidth={1.5} />
          <span>搜索</span>
        </div>
        <div className="flex items-center gap-3 px-3 py-2 text-sm text-[#888] hover:bg-white/5 hover:text-white rounded-xl cursor-pointer transition-all duration-200">
          <LayoutTemplate size={16} strokeWidth={1.5} />
          <span>项目</span>
        </div>
        <div className="flex items-center gap-3 px-3 py-2 text-sm text-[#888] hover:bg-white/5 hover:text-white rounded-xl cursor-pointer transition-all duration-200">
            <SquareTerminal size={16} strokeWidth={1.5} />
            <span>Artifacts</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto mt-4 px-3 scrollbar-thin scrollbar-thumb-white/10">
        <h3 className="px-3 text-[11px] font-semibold text-[#555] mb-3 uppercase tracking-wider">最近</h3>
        <div className="space-y-1">
          {sortedSessions.map((session) => (
            <div
              key={session.id}
              onClick={() => onSelectSession(session.id)}
              className={`group flex items-center justify-between px-3 py-2.5 text-sm rounded-xl cursor-pointer transition-all duration-200 ${currentSessionId === session.id ? 'bg-white/10 text-white font-medium' : 'text-[#888] hover:bg-white/5 hover:text-white'}`}
            >
              <span className="truncate flex-1 pr-2">{session.title || '新对话'}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteSession(session.id);
                }}
                className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-white/10 rounded-lg text-[#666] hover:text-red-400 transition-all"
                title="删除会话"
              >
                <Trash2 size={14} strokeWidth={1.5} />
              </button>
            </div>
          ))}
          {sortedSessions.length === 0 && (
            <div className="px-3 text-xs text-[#555] italic">暂无历史</div>
          )}
        </div>
      </div>

      <div className="p-4 mt-auto border-t border-white/5">
        <div className="flex items-center gap-3 px-3 py-2.5 hover:bg-white/5 rounded-xl cursor-pointer transition-all duration-200">
           <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neutral-700 to-neutral-900 border border-white/10 flex items-center justify-center text-xs font-bold text-white shadow-inner">
             Me
           </div>
           <div className="flex-1 overflow-hidden">
             <div className="text-sm font-medium text-[#ececec] truncate">我的账号</div>
             <div className="text-[11px] text-[#666] truncate mt-0.5">好朋友计划</div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
