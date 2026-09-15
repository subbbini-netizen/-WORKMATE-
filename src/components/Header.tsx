import React, { useState, useRef, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  CheckCircle2, 
  Edit2, 
  Check, 
  FileText, 
  Sparkles,
  Crown
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { TodoItem, ScheduleItem, MemoItem, UserProfile } from '../types';
import { WorkmateLogoIcon } from './Characters';
import achievementBadgeImg from '../assets/images/achievement_badge_1789386224964.jpg';
import avatar1 from '../assets/images/profile_avatar_user_1789386830218.jpg';
import avatar2 from '../assets/images/profile_avatar_two_1789386843384.jpg';

interface HeaderProps {
  username: string;
  onUpdateUsername: (name: string) => void;
  onResetData: () => void;
  todos: TodoItem[];
  schedules: ScheduleItem[];
  memos: MemoItem[];
  userProfile?: UserProfile;
  onNavigateToProfile?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  username,
  onUpdateUsername,
  onResetData,
  todos,
  schedules,
  memos,
  userProfile,
  onNavigateToProfile,
}) => {
  const headerAvatarSrc =
    userProfile?.avatarUrl === 'avatar-2'
      ? avatar2
      : userProfile?.avatarUrl && (userProfile.avatarUrl.startsWith('http') || userProfile.avatarUrl.startsWith('data:'))
      ? userProfile.avatarUrl
      : avatar1;

  // Format today's date in Korean
  const today = new Date();
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  const formattedDate = `${today.getMonth() + 1}월 ${today.getDate()}일 (${days[today.getDay()]})`;

  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  
  // Calculate today's stats
  const todayTodos = todos.filter(t => t.dueDate === todayStr);
  const relevantTodos = todayTodos.length > 0 ? todayTodos : todos;
  const completedCount = relevantTodos.filter(t => t.completed).length;
  const totalCount = relevantTodos.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const isHundredPercent = totalCount > 0 && progressPercent === 100;

  // 100% Achievement Detection & Confetti burst
  const prevProgressRef = useRef<number>(progressPercent);

  useEffect(() => {
    // Detect the exact transition to 100%
    if (isHundredPercent && prevProgressRef.current < 100) {
      try {
        confetti({
          particleCount: 65,
          spread: 60,
          origin: { y: 0.18 },
          colors: ['#DDD6FE', '#C7D2FE', '#FDE68A', '#FBCFE8', '#A7F3D0', '#BAE6FD'],
          ticks: 120,
          gravity: 1.1,
          scalar: 0.9,
        });
      } catch (err) {
        console.warn('Confetti animation error', err);
      }
    }
    prevProgressRef.current = progressPercent;
  }, [progressPercent, isHundredPercent]);

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-slate-100 sticky top-0 z-30 transition-all shadow-xs">
      <div className="max-w-4xl mx-auto px-4 py-2.5 sm:py-3">
        {/* Top bar: Brand & Profile (Reload button removed as requested) */}
        <div className="flex items-center justify-between gap-3">
          {/* Brand Logo with WORKMATE Mascot Icon */}
          <div className="flex items-center gap-2.5">
            <div className="relative group cursor-pointer">
              <WorkmateLogoIcon size={44} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-[#6D28D9]">
                  WORKMATE
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
                <CalendarIcon className="w-3.5 h-3.5 text-[#7C3AED]" />
                <span>{formattedDate}</span>
              </div>
            </div>
          </div>

          {/* User Profile Chip */}
          <div className="flex items-center gap-2">
            <button
              onClick={onNavigateToProfile}
              className="flex items-center gap-1.5 bg-slate-100/90 hover:bg-purple-50 px-2.5 py-1 rounded-2xl border border-slate-200/80 hover:border-purple-200 transition-all cursor-pointer group"
              title="내 프로필 설정"
            >
              <img
                src={headerAvatarSrc}
                alt={username}
                className="w-6 h-6 rounded-full object-cover ring-1 ring-white shadow-2xs group-hover:scale-105 transition-transform"
              />
              <span className="text-xs font-bold text-slate-700 group-hover:text-purple-700">
                {userProfile?.nickname || username}
              </span>
              {userProfile?.tagId && (
                <span className="text-[10px] font-black text-purple-600 bg-purple-100/60 px-1 py-0.5 rounded-md">
                  {userProfile.tagId}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Progress Line with 100% Achievement Motion & Pastel Halo */}
        <div 
          className={`mt-2.5 rounded-2xl p-2 sm:px-3.5 sm:py-2 flex items-center justify-between gap-3 transition-all duration-500 ${
            isHundredPercent 
              ? 'bg-gradient-to-r from-amber-50 via-purple-50 to-pink-50 border-2 border-amber-300 shadow-md shadow-amber-100/60 ring-2 ring-amber-200/40' 
              : 'bg-gradient-to-r from-purple-50/70 via-indigo-50/50 to-blue-50/70 border border-purple-100/60'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {/* Achievement Badge Icon with Bouncy Motion & Pastel Halo on 100% */}
            <div className="relative flex items-center justify-center">
              {/* Pastel Halo / Ping waves behind icon when 100% */}
              {isHundredPercent && (
                <>
                  <span className="absolute -inset-2 rounded-full bg-amber-300/40 animate-ping pointer-events-none" />
                  <span className="absolute -inset-2.5 rounded-full bg-gradient-to-r from-purple-300/30 to-amber-300/50 animate-pulse blur-xs pointer-events-none" />
                </>
              )}

              {/* Main Badge Image (Bounce on 100%) */}
              <div className={`relative ${isHundredPercent ? 'animate-bounce' : 'transition-transform'}`}>
                <img
                  src={achievementBadgeImg}
                  alt="성취도 마스코트"
                  className={`w-7 h-7 rounded-full object-cover shrink-0 shadow-xs border-2 transition-all ${
                    isHundredPercent 
                      ? 'border-amber-400 ring-2 ring-amber-300/60 scale-105' 
                      : 'border-white'
                  }`}
                  referrerPolicy="no-referrer"
                />

                {/* Sparkling crown / star on top of icon when 100% */}
                {isHundredPercent && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-amber-400 text-white rounded-full flex items-center justify-center shadow-xs">
                    <Crown className="w-2.5 h-2.5 fill-current text-white stroke-[2.5]" />
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-black">
              <span className={`text-[11px] font-bold ${isHundredPercent ? 'text-amber-700' : 'text-purple-700'}`}>
                성취도
              </span>
              <span className={isHundredPercent ? 'text-amber-600 font-black flex items-center gap-0.5' : 'text-slate-800'}>
                {progressPercent}%
                {isHundredPercent && <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" style={{ animationDuration: '3s' }} />}
              </span>
            </div>

            {/* Visual Progress Track */}
            <div className={`w-20 sm:w-40 rounded-full h-2 overflow-hidden shadow-inner border transition-all ${
              isHundredPercent ? 'bg-amber-100/80 border-amber-300' : 'bg-white border-purple-100'
            }`}>
              <div
                className={`h-full rounded-full transition-all duration-500 ease-out ${
                  isHundredPercent 
                    ? 'bg-gradient-to-r from-amber-400 via-rose-400 to-purple-500' 
                    : 'bg-gradient-to-r from-[#7C3AED] to-blue-500'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {isHundredPercent && (
              <span className="hidden sm:inline-block text-[11px] font-extrabold text-amber-800 bg-amber-100/90 px-2 py-0.5 rounded-full border border-amber-300/80 animate-pulse">
                오늘의 목표 달성!
              </span>
            )}
          </div>

          {/* Icon summary counts */}
          <div className="flex items-center gap-1.5 sm:gap-2 text-xs font-bold text-slate-600">
            <span className="px-2 py-0.5 bg-white/90 rounded-lg border border-purple-100 text-blue-600 flex items-center gap-1 shadow-2xs">
              <CalendarIcon className="w-3.5 h-3.5 text-blue-500" />
              <span>{schedules.length}</span>
            </span>
            <span className="px-2 py-0.5 bg-white/90 rounded-lg border border-purple-100 text-purple-600 flex items-center gap-1 shadow-2xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-purple-500" />
              <span>{todos.filter(t => !t.completed).length}</span>
            </span>
            <span className="px-2 py-0.5 bg-white/90 rounded-lg border border-purple-100 text-amber-600 flex items-center gap-1 shadow-2xs">
              <FileText className="w-3.5 h-3.5 text-amber-500" />
              <span>{memos.length}</span>
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

