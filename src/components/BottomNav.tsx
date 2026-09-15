import React from 'react';
import { LayoutDashboard, Calendar, MessageSquare, User, Plus } from 'lucide-react';
import { TabType } from '../types';

interface BottomNavProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  onOpenQuickAdd: () => void;
  schedulesCount: number;
  todosActiveCount: number;
  memosCount: number;
  unreadChatsCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onSelectTab,
  onOpenQuickAdd,
  schedulesCount,
  todosActiveCount,
  memosCount,
  unreadChatsCount = 0,
}) => {
  return (
    <>
      {/* Floating Action Button (+) */}
      <div className="fixed bottom-20 right-5 sm:right-8 z-30">
        <button
          id="fab-quick-add"
          onClick={onOpenQuickAdd}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/40 hover:shadow-blue-500/60 hover:scale-110 active:scale-95 transition-all cursor-pointer group"
          title="빠른 추가 (일정/할일/메모)"
        >
          <Plus className="w-7 h-7 group-hover:rotate-90 transition-transform duration-300 stroke-[2.5]" />
        </button>
      </div>

      {/* Bottom Navigation Bar - Exactly: Dashboard, Calendar, Chat, Profile */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200/80 shadow-lg">
        <div className="max-w-md mx-auto px-4 py-2.5 flex items-center justify-around">
          {/* 1. Dashboard Tab */}
          <button
            id="tab-dashboard"
            onClick={() => onSelectTab('dashboard')}
            className={`p-3 rounded-2xl transition-all cursor-pointer relative ${
              currentTab === 'dashboard'
                ? 'bg-blue-50 text-blue-600 shadow-2xs scale-105'
                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
            }`}
            title="대시보드"
            aria-label="대시보드"
          >
            <LayoutDashboard className="w-6 h-6 stroke-[2.2]" />
            {currentTab === 'dashboard' && (
              <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-600" />
            )}
          </button>

          {/* 2. Calendar Tab */}
          <button
            id="tab-calendar"
            onClick={() => onSelectTab('calendar')}
            className={`p-3 rounded-2xl transition-all cursor-pointer relative ${
              currentTab === 'calendar' || currentTab === 'schedule'
                ? 'bg-indigo-50 text-indigo-600 shadow-2xs scale-105'
                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
            }`}
            title="캘린더"
            aria-label="캘린더"
          >
            <div className="relative">
              <Calendar className="w-6 h-6 stroke-[2.2]" />
              {schedulesCount > 0 && (
                <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-blue-500 text-white text-[10px] font-black flex items-center justify-center border-2 border-white shadow-2xs">
                  {schedulesCount}
                </span>
              )}
            </div>
            {(currentTab === 'calendar' || currentTab === 'schedule') && (
              <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-indigo-600" />
            )}
          </button>

          {/* 3. Chat Tab */}
          <button
            id="tab-chat"
            onClick={() => onSelectTab('chat')}
            className={`p-3 rounded-2xl transition-all cursor-pointer relative ${
              currentTab === 'chat'
                ? 'bg-blue-50 text-blue-600 shadow-2xs scale-105'
                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
            }`}
            title="채팅"
            aria-label="채팅"
          >
            <div className="relative">
              <MessageSquare className="w-6 h-6 stroke-[2.2]" />
              {unreadChatsCount > 0 && (
                <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center border-2 border-white shadow-2xs animate-pulse">
                  {unreadChatsCount}
                </span>
              )}
            </div>
            {currentTab === 'chat' && (
              <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-600" />
            )}
          </button>

          {/* 4. Profile Tab */}
          <button
            id="tab-profile"
            onClick={() => onSelectTab('profile')}
            className={`p-3 rounded-2xl transition-all cursor-pointer relative ${
              currentTab === 'profile'
                ? 'bg-purple-50 text-purple-600 shadow-2xs scale-105'
                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
            }`}
            title="프로필"
            aria-label="프로필"
          >
            <div className="relative">
              <User className="w-6 h-6 stroke-[2.2]" />
            </div>
            {currentTab === 'profile' && (
              <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-purple-600" />
            )}
          </button>
        </div>
      </div>
    </>
  );
};

