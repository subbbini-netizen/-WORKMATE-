import React, { useState } from 'react';
import { 
  Clock, 
  MapPin, 
  Plus, 
  Check, 
  Calendar as CalendarIcon, 
  ArrowRight, 
  Pin, 
  Sparkles,
  Edit2,
  Trash2,
  CheckCircle,
  Circle,
  Users,
  MessageSquare,
  CheckCheck,
  X,
  Copy,
  Tag,
  Smile,
  Send,
  PenTool
} from 'lucide-react';
import { ScheduleItem, TodoItem, MemoItem, PriorityLevel, ShareRequest } from '../types';
import { 
  StarCharacter, 
  CloudCharacter, 
  PencilBlob, 
  EggCharacter,
  FlowerSticker,
  HeartSticker,
  ThankYouSticker,
  StarSticker
} from './Characters';

interface DashboardViewProps {
  schedules: ScheduleItem[];
  todos: TodoItem[];
  memos: MemoItem[];
  shareRequests: ShareRequest[];
  onAcceptShareRequest: (id: string) => void;
  onDeclineShareRequest: (id: string) => void;
  onOpenChatWithFriend: (friendTagOrName: string, scheduleTitle?: string) => void;
  onToggleTodo: (id: string) => void;
  onOpenScheduleModal: (item?: ScheduleItem) => void;
  onOpenTodoModal: (item?: TodoItem) => void;
  onOpenMemoModal: (item?: MemoItem) => void;
  onSaveMemo?: (itemData: Omit<MemoItem, 'id'>, id?: string) => void;
  onTogglePinMemo?: (id: string) => void;
  onDeleteSchedule: (id: string) => void;
  onDeleteTodo: (id: string) => void;
  onDeleteMemo: (id: string) => void;
  onNavigateTab: (tab: 'calendar' | 'chat' | 'profile' | 'todo' | 'memo') => void;
}


export const DashboardView: React.FC<DashboardViewProps> = ({
  schedules,
  todos,
  memos,
  shareRequests,
  onAcceptShareRequest,
  onDeclineShareRequest,
  onOpenChatWithFriend,
  onToggleTodo,
  onOpenScheduleModal,
  onOpenTodoModal,
  onOpenMemoModal,
  onSaveMemo,
  onTogglePinMemo,
  onDeleteSchedule,
  onDeleteTodo,
  onDeleteMemo,
  onNavigateTab,
}) => {

  // Sort schedules by start time
  const sortedSchedules = [...schedules].sort((a, b) => a.startTime.localeCompare(b.startTime));

  // Sort todos: incomplete first, then by priority
  const priorityWeight: Record<PriorityLevel, number> = { high: 3, medium: 2, low: 1 };
  const sortedTodos = [...todos].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    return priorityWeight[b.priority] - priorityWeight[a.priority];
  });

  // Quick Note Composer state (Dashboard First-tab in-place memo)
  const [isQuickComposerOpen, setIsQuickComposerOpen] = useState(false);
  const [quickTitle, setQuickTitle] = useState('');
  const [quickContent, setQuickContent] = useState('');
  const [quickColor, setQuickColor] = useState('yellow');
  const [quickCategory, setQuickCategory] = useState('아이디어');
  const [quickSticker, setQuickSticker] = useState<string>('flower');
  const [copiedMemoId, setCopiedMemoId] = useState<string | null>(null);
  const [memoCategoryFilter, setMemoCategoryFilter] = useState<string>('all');

  // Filtered recent memos
  const filteredMemos = memos
    .filter((m) => memoCategoryFilter === 'all' || m.category === memoCategoryFilter)
    .sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      return b.createdAt.localeCompare(a.createdAt);
    });

  const handleQuickMemoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickContent.trim() && !quickTitle.trim()) return;

    const todayStr = new Date().toISOString().split('T')[0];
    if (onSaveMemo) {
      onSaveMemo({
        title: quickTitle.trim() || '메모',
        content: quickContent.trim(),
        color: quickColor,
        category: quickCategory,
        sticker: quickSticker === 'none' ? undefined : quickSticker,
        createdAt: todayStr,
      });
    }

    setQuickTitle('');
    setQuickContent('');
    setIsQuickComposerOpen(false);
  };

  const handleCopyMemoText = (memo: MemoItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const textToCopy = `${memo.title ? `[${memo.title}]\n` : ''}${memo.content}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedMemoId(memo.id);
    setTimeout(() => setCopiedMemoId(null), 1800);
  };

  const getMemoPastelClass = (color?: string) => {
    switch (color) {
      case 'pink':
        return 'bg-[#FFF1F2] border-[#FECDD3] text-[#881337] shadow-rose-100/50';
      case 'mint':
      case 'green':
        return 'bg-[#F0FDF4] border-[#BBF7D0] text-[#14532D] shadow-emerald-100/50';
      case 'blue':
        return 'bg-[#F0F9FF] border-[#BAE6FD] text-[#0369A1] shadow-sky-100/50';
      case 'purple':
        return 'bg-[#F5F3FF] border-[#DDD6FE] text-[#5B21B6] shadow-purple-100/50';
      case 'lilac':
        return 'bg-[#FDF4FF] border-[#F5D0FE] text-[#86198F] shadow-fuchsia-100/50';
      case 'yellow':
      default:
        return 'bg-[#FEFCE8] border-[#FEF08A] text-[#854D0E] shadow-amber-100/50';
    }
  };

  const renderStickerComponent = (stickerType?: string) => {
    switch (stickerType) {
      case 'flower':
        return <FlowerSticker size={38} className="absolute -bottom-1.5 -right-1.5 pointer-events-none z-10" />;
      case 'heart':
        return <HeartSticker size={34} className="absolute -bottom-1 -right-1 pointer-events-none z-10" />;
      case 'thankyou':
        return <ThankYouSticker size={48} className="absolute -bottom-1 -right-1 pointer-events-none z-10" />;
      case 'star':
        return <StarSticker size={32} className="absolute -bottom-1 -right-1 pointer-events-none z-10" />;
      default:
        return null;
    }
  };


  // Pending share requests
  const pendingRequests = shareRequests.filter((r) => r.status === 'pending');

  const getPriorityBadge = (priority: PriorityLevel) => {
    switch (priority) {
      case 'high':
        return (
          <span className="px-1.5 py-0.5 rounded-md text-[10px] font-extrabold bg-rose-50 text-rose-600 border border-rose-200">
            상
          </span>
        );
      case 'medium':
        return (
          <span className="px-1.5 py-0.5 rounded-md text-[10px] font-extrabold bg-amber-50 text-amber-600 border border-amber-200">
            중
          </span>
        );
      case 'low':
        return (
          <span className="px-1.5 py-0.5 rounded-md text-[10px] font-extrabold bg-emerald-50 text-emerald-600 border border-emerald-200">
            하
          </span>
        );
    }
  };

  const getScheduleColorBorder = (color?: string) => {
    switch (color) {
      case 'purple':
        return 'border-l-purple-500 bg-purple-50/30';
      case 'amber':
        return 'border-l-amber-500 bg-amber-50/30';
      case 'emerald':
        return 'border-l-emerald-500 bg-emerald-50/30';
      case 'indigo':
        return 'border-l-indigo-500 bg-indigo-50/30';
      case 'blue':
      default:
        return 'border-l-blue-500 bg-blue-50/30';
    }
  };

  const getMemoColorClass = (color?: string) => {
    switch (color) {
      case 'blue':
        return 'bg-blue-50/80 border-blue-200 text-blue-950';
      case 'purple':
        return 'bg-purple-50/80 border-purple-200 text-purple-950';
      case 'green':
        return 'bg-emerald-50/80 border-emerald-200 text-emerald-950';
      case 'pink':
        return 'bg-pink-50/80 border-pink-200 text-pink-950';
      case 'yellow':
      default:
        return 'bg-amber-50/80 border-amber-200 text-amber-950';
    }
  };

  return (
    <div className="space-y-6 pb-24">
      {/* 0. PENDING SCHEDULE SHARE REQUESTS (TOP NOTIFICATION CARDS) */}
      {pendingRequests.length > 0 && (
        <div className="space-y-3">
          {pendingRequests.map((req) => (
            <div
              key={req.id}
              className="bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 text-white rounded-3xl p-4 sm:p-5 shadow-md shadow-blue-500/15 relative overflow-hidden"
            >
              {/* Decorative background glow */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none -mr-10 -mt-10" />

              <div className="relative z-10">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center font-bold text-white">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-black text-white/90">
                          {req.fromName}
                        </span>
                        <span className="text-[10px] font-bold bg-white/20 px-1.5 py-0.2 rounded-md">
                          {req.fromTag}
                        </span>
                        <span className="text-xs text-white/80">
                          님이 일정을 공유했습니다
                        </span>
                      </div>
                      <span className="text-[10px] text-white/60">
                        {req.createdAt}
                      </span>
                    </div>
                  </div>

                  <span className="text-[11px] font-black bg-amber-400 text-amber-950 px-2 py-0.5 rounded-full shadow-2xs">
                    공유 요청
                  </span>
                </div>

                {/* Schedule preview inside request */}
                <div className="mt-3 bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-bold text-sm text-white truncate">
                      {req.schedule.title}
                    </h4>
                    <span className="text-xs text-white/90 shrink-0 font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3 text-blue-200" />
                      {req.schedule.startTime} - {req.schedule.endTime}
                    </span>
                  </div>

                  {(req.schedule.location || req.schedule.notes) && (
                    <div className="mt-1 text-xs text-white/80 flex flex-wrap items-center gap-2">
                      {req.schedule.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-blue-200" />
                          {req.schedule.location}
                        </span>
                      )}
                      {req.schedule.notes && (
                        <span className="opacity-80 truncate max-w-xs">
                          {req.schedule.notes}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Action buttons */}
                <div className="mt-3.5 flex items-center justify-end gap-2">
                  <button
                    onClick={() => onDeclineShareRequest(req.id)}
                    className="px-3.5 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>거절</span>
                  </button>
                  <button
                    onClick={() => onAcceptShareRequest(req.id)}
                    className="px-4 py-1.5 rounded-xl bg-white text-indigo-700 hover:bg-blue-50 text-xs font-black shadow-sm transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    <span>수락 및 등록</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 1. TODAY'S SCHEDULE SECTION */}
      <div className="relative bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-sm transition-all hover:shadow-md">
        {/* Mascot decoration sitting on top right */}
        <div className="absolute -top-6 right-5 pointer-events-none z-10">
          <StarCharacter size={56} />
        </div>

        {/* Section Header */}
        <div className="flex items-center justify-between mb-4 pr-12">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
              <Clock className="w-4 h-4" />
            </div>
            <h2 className="text-base sm:text-lg font-black text-slate-800 tracking-tight flex items-center gap-1.5">
              오늘의 일정
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100">
                {sortedSchedules.length}
              </span>
            </h2>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onOpenScheduleModal()}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-xl border border-blue-100 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>일정 추가</span>
            </button>
            <button
              onClick={() => onNavigateTab('calendar')}
              className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              title="월별 캘린더 보기"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Schedule List */}
        {sortedSchedules.length === 0 ? (
          <div className="text-center py-6 bg-slate-50/60 rounded-2xl border border-dashed border-slate-200">
            <p className="text-xs font-bold text-slate-600">등록된 일정이 없습니다</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedSchedules.map((sch) => {
              const sharedPartner = sch.sharedBy || (sch.sharedWith && sch.sharedWith[0]);

              return (
                <div
                  key={sch.id}
                  className={`p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 border-l-4 ${getScheduleColorBorder(
                    sch.color
                  )} bg-white transition-all hover:shadow-xs group`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="flex items-start gap-3">
                      {/* Time pill */}
                      <div className="shrink-0 px-2.5 py-1 rounded-xl bg-slate-100 border border-slate-200/60 text-slate-700 text-xs font-extrabold flex items-center gap-1">
                        <Clock className="w-3 h-3 text-blue-500" />
                        <span>{sch.startTime} - {sch.endTime}</span>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-sm sm:text-base font-bold text-slate-800 leading-tight">
                            {sch.title}
                          </h3>

                          {/* Shared partner badge if shared */}
                          {sharedPartner && (
                            <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <Users className="w-2.5 h-2.5" />
                              공유: {sharedPartner}
                            </span>
                          )}
                        </div>

                        {sch.location && (
                          <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            <span>{sch.location}</span>
                          </div>
                        )}
                        {sch.notes && (
                          <p className="text-xs text-slate-500 mt-1 line-clamp-1 bg-slate-50/80 px-2 py-0.5 rounded-md inline-block">
                            {sch.notes}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Actions & Chat Shortcut */}
                    <div className="flex items-center gap-1.5 self-end sm:self-center">
                      {/* If shared, direct Chat button */}
                      {sharedPartner && (
                        <button
                          onClick={() => onOpenChatWithFriend(sharedPartner, sch.title)}
                          className="px-2.5 py-1 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold border border-blue-200 flex items-center gap-1 transition-colors cursor-pointer"
                          title="관련 대화방으로 이동"
                        >
                          <MessageSquare className="w-3 h-3" />
                          <span>채팅</span>
                        </button>
                      )}

                      <div className="flex items-center gap-1 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => onOpenScheduleModal(sch)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          title="일정 수정"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm('이 일정을 삭제할까요?')) {
                              onDeleteSchedule(sch.id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="일정 삭제"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 2. TODAY'S TO-DO LIST SECTION */}
      <div className="relative bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-sm transition-all hover:shadow-md">
        {/* Mascot decoration sitting on top right */}
        <div className="absolute -top-5 right-6 pointer-events-none z-10">
          <CloudCharacter size={62} />
        </div>

        {/* Section Header */}
        <div className="flex items-center justify-between mb-4 pr-14">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-[#7C3AED] flex items-center justify-center font-bold">
              <CheckCircle className="w-4 h-4" />
            </div>
            <h2 className="text-base sm:text-lg font-black text-slate-800 tracking-tight flex items-center gap-1.5">
              오늘의 할 일
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-50 text-[#7C3AED] border border-purple-100">
                {todos.filter(t => !t.completed).length}
              </span>
            </h2>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onOpenTodoModal()}
              className="text-xs font-bold text-[#7C3AED] hover:text-purple-700 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-xl border border-purple-100 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>할 일 추가</span>
            </button>
            <button
              onClick={() => onNavigateTab('todo')}
              className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              title="전체 할 일 보기"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Todo List */}
        {sortedTodos.length === 0 ? (
          <div className="text-center py-6 bg-slate-50/60 rounded-2xl border border-dashed border-slate-200">
            <p className="text-xs font-bold text-slate-600">등록된 할 일이 없습니다</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {sortedTodos.slice(0, 6).map((todo) => (
              <div
                key={todo.id}
                className={`flex items-center justify-between p-3 sm:p-3.5 rounded-2xl border transition-all group ${
                  todo.completed
                    ? 'bg-slate-50/60 border-slate-200/60 text-slate-400'
                    : 'bg-white border-slate-200 hover:border-indigo-200 hover:shadow-xs text-slate-800'
                }`}
              >
                {/* Left: Checkbox & Title */}
                <div className="flex items-center gap-3 min-w-0 flex-1 mr-2">
                  <button
                    type="button"
                    onClick={() => onToggleTodo(todo.id)}
                    className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all shrink-0 cursor-pointer ${
                      todo.completed
                        ? 'bg-emerald-500 text-white shadow-xs'
                        : 'border-2 border-slate-300 hover:border-indigo-500 bg-white'
                    }`}
                  >
                    {todo.completed && <Check className="w-4 h-4 stroke-[3]" />}
                  </button>

                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-sm font-bold truncate transition-all cursor-pointer ${
                        todo.completed ? 'line-through text-slate-400' : 'text-slate-800'
                      }`}
                      onClick={() => onToggleTodo(todo.id)}
                    >
                      {todo.title}
                    </p>
                    {todo.notes && (
                      <p className="text-xs text-slate-400 truncate mt-0.5">{todo.notes}</p>
                    )}
                  </div>
                </div>

                {/* Right: Badges & Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <span className="hidden sm:inline-block text-[11px] text-slate-400 font-medium">
                    {todo.dueDate}
                  </span>
                  {getPriorityBadge(todo.priority)}

                  <div className="flex items-center gap-1 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onOpenTodoModal(todo)}
                      className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                      title="수정"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm('이 할 일을 삭제할까요?')) {
                          onDeleteTodo(todo.id);
                        }
                      }}
                      className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="삭제"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. FREEFORM PASTEL MEMOS BOARD (대시보드 첫번째 탭 자유 메모) */}
      <div className="relative bg-white rounded-3xl p-5 sm:p-6 border border-purple-100/80 shadow-sm transition-all hover:shadow-md overflow-hidden">
        {/* Playful Background Pastel Glow */}
        <div className="absolute top-0 right-0 w-56 h-56 bg-gradient-to-br from-amber-100/40 via-purple-100/30 to-pink-100/30 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />

        {/* Mascot decoration */}
        <div className="absolute -top-3 right-6 pointer-events-none z-10 hidden sm:block">
          <PencilBlob size={58} />
        </div>

        {/* Section Header */}
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:pr-14">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-amber-100/80 text-amber-700 flex items-center justify-center font-bold shadow-2xs">
              <PenTool className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-800 tracking-tight flex items-center gap-2">
                자유 메모 보드
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100/80 text-amber-800 border border-amber-200">
                  {memos.length}
                </span>
              </h2>
              <p className="text-[11px] text-slate-400 font-medium">
                자유로운 스티커와 파스텔 노트로 업무 아이디어를 기록하세요
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsQuickComposerOpen(!isQuickComposerOpen)}
              className={`text-xs font-bold px-3.5 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs ${
                isQuickComposerOpen
                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                  : 'text-amber-800 bg-amber-50 hover:bg-amber-100/80 border-amber-200'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isQuickComposerOpen ? '작성 닫기' : '메모 작성'}</span>
            </button>
            <button
              onClick={() => onOpenMemoModal()}
              className="text-xs font-bold text-slate-500 hover:text-slate-700 bg-slate-100 hover:bg-slate-200/80 px-2.5 py-1.5 rounded-xl transition-colors cursor-pointer"
              title="상세 모달로 열기"
            >
              상세 작성
            </button>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="relative z-10 flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none mb-3">
          {['all', '아이디어', '업무', '회의록', '개인'].map((cat) => (
            <button
              key={cat}
              onClick={() => setMemoCategoryFilter(cat)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                memoCategoryFilter === cat
                  ? 'bg-[#7C3AED] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat === 'all' ? '전체 보기' : cat}
            </button>
          ))}
        </div>

        {/* INLINE QUICK MEMO COMPOSER (In-place on Dashboard Tab 1) */}
        {isQuickComposerOpen && (
          <form
            onSubmit={handleQuickMemoSubmit}
            className="relative z-10 mb-5 p-4 sm:p-5 rounded-3xl border-2 border-amber-200/80 bg-[#FEFCE8] shadow-sm transition-all animate-in fade-in zoom-in-95 duration-200"
          >
            {/* Washi Tape Header accent */}
            <div className="w-16 h-3 bg-amber-200/60 rounded-xs mx-auto -mt-2 mb-3 shadow-2xs border border-amber-300/30" />

            <div className="space-y-3">
              <input
                type="text"
                value={quickTitle}
                onChange={(e) => setQuickTitle(e.target.value)}
                placeholder="메모 제목 (예: 신규 프로젝트 아이디어)"
                maxLength={40}
                className="w-full bg-white/80 backdrop-blur-xs font-bold text-sm text-amber-950 px-3.5 py-2 rounded-xl border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
              />

              <textarea
                value={quickContent}
                onChange={(e) => setQuickContent(e.target.value)}
                placeholder="자유롭게 생각이나 할 일, 회의 내용을 적어보세요..."
                rows={3}
                required
                className="w-full bg-white/80 backdrop-blur-xs text-xs sm:text-sm text-amber-900 px-3.5 py-2.5 rounded-xl border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-400/50 resize-none leading-relaxed"
                style={{
                  backgroundImage: 'repeating-linear-gradient(transparent, transparent 22px, rgba(217, 119, 6, 0.08) 23px)',
                  lineHeight: '23px',
                }}
              />

              {/* Bottom Customizers: Pastel Colors, Stickers & Category */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-amber-200/60">
                {/* Pastel Color Selector */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-extrabold text-amber-800">색상:</span>
                  {[
                    { key: 'yellow', bg: 'bg-[#FEF08A]' },
                    { key: 'pink', bg: 'bg-[#FECDD3]' },
                    { key: 'mint', bg: 'bg-[#A7F3D0]' },
                    { key: 'blue', bg: 'bg-[#BAE6FD]' },
                    { key: 'purple', bg: 'bg-[#DDD6FE]' },
                    { key: 'lilac', bg: 'bg-[#F5D0FE]' },
                  ].map((c) => (
                    <button
                      key={c.key}
                      type="button"
                      onClick={() => setQuickColor(c.key)}
                      className={`w-5 h-5 rounded-full ${c.bg} border-2 transition-transform cursor-pointer ${
                        quickColor === c.key ? 'scale-125 border-slate-700 ring-2 ring-white' : 'border-black/10'
                      }`}
                    />
                  ))}
                </div>

                {/* Sticker Attachment Selector */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-extrabold text-amber-800">스티커:</span>
                  {[
                    { key: 'flower', label: '🌸 꽃' },
                    { key: 'heart', label: '❤️ 하트' },
                    { key: 'thankyou', label: '💌 감사' },
                    { key: 'star', label: '⭐ 별' },
                    { key: 'none', label: '없음' },
                  ].map((stk) => (
                    <button
                      key={stk.key}
                      type="button"
                      onClick={() => setQuickSticker(stk.key)}
                      className={`px-2 py-0.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                        quickSticker === stk.key
                          ? 'bg-amber-600 text-white shadow-2xs'
                          : 'bg-white/80 text-amber-800 border border-amber-200/80 hover:bg-amber-100'
                      }`}
                    >
                      {stk.label}
                    </button>
                  ))}
                </div>

                {/* Category Chip Selector */}
                <div className="flex items-center gap-1">
                  <span className="text-[11px] font-extrabold text-amber-800">분류:</span>
                  {['아이디어', '업무', '회의록', '개인'].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setQuickCategory(cat)}
                      className={`px-2 py-0.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                        quickCategory === cat
                          ? 'bg-purple-600 text-white shadow-2xs'
                          : 'bg-white/80 text-slate-600 border border-slate-200 hover:bg-purple-50'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Form Buttons */}
                <div className="flex items-center gap-2 ml-auto">
                  <button
                    type="button"
                    onClick={() => setIsQuickComposerOpen(false)}
                    className="px-3 py-1.5 text-xs font-bold text-slate-500 hover:text-slate-700 bg-white/70 rounded-xl border border-slate-200 cursor-pointer"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 text-xs font-bold bg-[#7C3AED] hover:bg-purple-700 text-white rounded-xl shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>메모 남기기</span>
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}

        {/* FREEFORM STICKY NOTES GRID */}
        {filteredMemos.length === 0 ? (
          <div className="relative z-10 text-center py-8 bg-amber-50/40 rounded-3xl border-2 border-dashed border-amber-200/80 flex flex-col items-center justify-center">
            <StarCharacter size={56} />
            <p className="text-xs font-extrabold text-slate-700 mt-2">
              아직 등록된 메모가 없습니다
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              상단의 [메모 작성]을 눌러 스티커가 달린 자유 메모를 남겨보세요!
            </p>
            <button
              onClick={() => setIsQuickComposerOpen(true)}
              className="mt-3 text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white px-3.5 py-1.5 rounded-xl shadow-2xs transition-colors cursor-pointer"
            >
              첫 메모 작성하기
            </button>
          </div>
        ) : (
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
            {filteredMemos.map((memo, idx) => {
              const pastelStyle = getMemoPastelClass(memo.color);
              // Playful tilt effect: alternating subtle angles
              const tiltClass =
                idx % 3 === 0
                  ? '-rotate-1 hover:rotate-0'
                  : idx % 3 === 1
                  ? 'rotate-1 hover:rotate-0'
                  : '-rotate-0.5 hover:rotate-0';

              return (
                <div
                  key={memo.id}
                  className={`group relative rounded-3xl p-4 sm:p-5 border-2 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md hover:scale-[1.02] flex flex-col justify-between overflow-visible ${pastelStyle} ${tiltClass}`}
                  onClick={() => onOpenMemoModal(memo)}
                >
                  {/* Top Washi-Tape Accent */}
                  <div className="w-14 h-3 bg-white/70 rounded-xs mx-auto -mt-3 mb-2 shadow-2xs backdrop-blur-2xs border border-black/5" />

                  {/* Die-cut sticker attached to note */}
                  {renderStickerComponent(memo.sticker || (memo.category === '아이디어' ? 'star' : memo.category === '회의록' ? 'flower' : undefined))}

                  {/* Top line: Category Chip & Action Icons */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/80 border border-black/5">
                      {memo.category || '메모'}
                    </span>

                    {/* Action Controls */}
                    <div className="flex items-center gap-1 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                      {/* Pin Toggle */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onTogglePinMemo) onTogglePinMemo(memo.id);
                        }}
                        className={`p-1 rounded-lg transition-colors cursor-pointer ${
                          memo.pinned ? 'bg-amber-200/80 text-amber-900' : 'hover:bg-black/5 text-slate-500'
                        }`}
                        title={memo.pinned ? '고정 해제' : '상단 고정'}
                      >
                        <Pin className={`w-3.5 h-3.5 ${memo.pinned ? 'rotate-45 fill-amber-500' : ''}`} />
                      </button>

                      {/* Copy Text */}
                      <button
                        type="button"
                        onClick={(e) => handleCopyMemoText(memo, e)}
                        className="p-1 rounded-lg hover:bg-black/5 text-slate-500 transition-colors cursor-pointer"
                        title="메모 복사"
                      >
                        {copiedMemoId === memo.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>

                      {/* Edit */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenMemoModal(memo);
                        }}
                        className="p-1 rounded-lg hover:bg-black/5 text-slate-500 transition-colors cursor-pointer"
                        title="수정"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm('이 메모를 삭제할까요?')) {
                            onDeleteMemo(memo.id);
                          }
                        }}
                        className="p-1 rounded-lg hover:bg-rose-100 hover:text-rose-600 text-slate-400 transition-colors cursor-pointer"
                        title="삭제"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Title & Ruled Note Content */}
                  <div className="min-h-[70px]">
                    {memo.title && (
                      <h3 className="font-black text-sm mb-1.5 leading-snug line-clamp-1">
                        {memo.title}
                      </h3>
                    )}
                    <p
                      className="text-xs leading-relaxed whitespace-pre-line line-clamp-4 font-medium opacity-90"
                      style={{
                        backgroundImage: 'repeating-linear-gradient(transparent, transparent 19px, rgba(0, 0, 0, 0.04) 20px)',
                        lineHeight: '20px',
                      }}
                    >
                      {memo.content}
                    </p>
                  </div>

                  {/* Footer Date & Status */}
                  <div className="mt-3 pt-2 border-t border-black/5 flex items-center justify-between text-[10px] font-semibold opacity-70">
                    <span>{memo.createdAt}</span>
                    <span className="text-purple-700 font-bold hover:underline">자세히 보기</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>


      {/* Encouragement Footer Card with Egg Character */}
      <div className="bg-gradient-to-r from-sky-50 to-indigo-50/70 rounded-3xl p-4 sm:p-5 border border-blue-100 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <EggCharacter size={52} />
          <div>
            <h4 className="text-sm font-extrabold text-slate-800">
              오늘의 업무 안내
            </h4>
            <p className="text-xs text-slate-600 mt-0.5">
              공유받은 일정과 오늘 할 일을 완료하고, 동업자와 실시간으로 의견을 조율해보세요.
            </p>
          </div>
        </div>
        <button
          onClick={() => onOpenTodoModal()}
          className="hidden sm:inline-flex shrink-0 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          새 할 일 등록
        </button>
      </div>
    </div>
  );
};

