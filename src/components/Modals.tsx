import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, MapPin, AlignLeft, Flag, Trash2, Pin, Sparkles, Users, UserCheck } from 'lucide-react';
import { ScheduleItem, TodoItem, MemoItem, PriorityLevel, Friend } from '../types';
import { getTodayDateString } from '../data/initialData';

// --- SCHEDULE MODAL ---
interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Omit<ScheduleItem, 'id'>, id?: string) => void;
  onDelete?: (id: string) => void;
  initialData?: ScheduleItem | null;
  defaultDate?: string;
  friends?: Friend[];
}

export const ScheduleModal: React.FC<ScheduleModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  initialData,
  defaultDate,
  friends = [],
}) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(defaultDate || getTodayDateString());
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [color, setColor] = useState('blue');
  const [selectedFriend, setSelectedFriend] = useState<string>('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDate(initialData.date);
      setStartTime(initialData.startTime);
      setEndTime(initialData.endTime);
      setLocation(initialData.location || '');
      setNotes(initialData.notes || '');
      setColor(initialData.color || 'blue');
      const partner = initialData.sharedBy || (initialData.sharedWith && initialData.sharedWith[0]) || '';
      setSelectedFriend(partner);
    } else {
      setTitle('');
      setDate(defaultDate || getTodayDateString());
      setStartTime('09:00');
      setEndTime('10:00');
      setLocation('');
      setNotes('');
      setColor('blue');
      setSelectedFriend('');
    }
  }, [initialData, isOpen, defaultDate]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave(
      {
        title: title.trim(),
        date,
        startTime,
        endTime,
        location: location.trim() || undefined,
        notes: notes.trim() || undefined,
        color,
        sharedWith: selectedFriend ? [selectedFriend] : undefined,
      },
      initialData?.id
    );
    onClose();
  };


  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-lg">
            <Calendar className="w-5 h-5" />
            <span>{initialData ? '일정 수정하기' : '새 일정 등록'}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/20 text-white/90 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              일정 제목 <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="예: 주간 기획 회의, 고객사 미팅"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">날짜</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">시작 시간</label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-2 py-2 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">종료 시간</label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full px-2 py-2 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">장소 / 링크</label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="예: 대회의실 A, 줌 화상링크"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">메모 / 준비사항</label>
            <textarea
              rows={2}
              placeholder="필요한 서류나 준비사항을 적어두세요"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Color tag selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">태그 컬러</label>
            <div className="flex items-center gap-3">
              {[
                { id: 'blue', label: '블루', bg: 'bg-blue-500' },
                { id: 'indigo', label: '인디고', bg: 'bg-indigo-500' },
                { id: 'purple', label: '퍼플', bg: 'bg-purple-500' },
                { id: 'amber', label: '오렌지', bg: 'bg-amber-500' },
                { id: 'emerald', label: '그린', bg: 'bg-emerald-500' },
              ].map((c) => (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => setColor(c.id)}
                  className={`w-7 h-7 rounded-full ${c.bg} transition-all cursor-pointer ${
                    color === c.id ? 'ring-3 ring-offset-2 ring-blue-500 scale-110' : 'opacity-70 hover:opacity-100'
                  }`}
                  title={c.label}
                />
              ))}
            </div>
          </div>

          {/* Friend sharing selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-indigo-600" />
                동업자와 일정 공유
              </span>
              <span className="text-[10px] text-slate-400 font-normal">선택 사항</span>
            </label>
            <select
              value={selectedFriend}
              onChange={(e) => setSelectedFriend(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="">공유 안 함 (나만의 개인 일정)</option>
              {friends.map((f) => (
                <option key={f.id} value={f.fullTag || `${f.name}${f.tag}`}>
                  {f.name} ({f.tag})
                </option>
              ))}
            </select>
            {selectedFriend && (
              <p className="text-[11px] text-indigo-600 font-medium mt-1">
                일정을 저장하면 {selectedFriend}님에게 공유 일정이 전달됩니다.
              </p>
            )}
          </div>


          <div className="pt-3 flex items-center justify-between gap-3 border-t border-slate-100">
            {initialData && onDelete ? (
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('정말 이 일정을 삭제하시겠습니까?')) {
                    onDelete(initialData.id);
                    onClose();
                  }
                }}
                className="px-3.5 py-2 rounded-xl text-rose-600 bg-rose-50 hover:bg-rose-100 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                삭제
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-bold transition-colors cursor-pointer"
              >
                취소
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all cursor-pointer"
              >
                {initialData ? '수정 완료' : '일정 저장'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- TODO MODAL ---
interface TodoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Omit<TodoItem, 'id' | 'completed'>, id?: string) => void;
  onDelete?: (id: string) => void;
  initialData?: TodoItem | null;
  defaultDate?: string;
}

export const TodoModal: React.FC<TodoModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  initialData,
  defaultDate,
}) => {
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState(defaultDate || getTodayDateString());
  const [priority, setPriority] = useState<PriorityLevel>('medium');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDueDate(initialData.dueDate);
      setPriority(initialData.priority);
      setNotes(initialData.notes || '');
    } else {
      setTitle('');
      setDueDate(defaultDate || getTodayDateString());
      setPriority('medium');
      setNotes('');
    }
  }, [initialData, isOpen, defaultDate]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave(
      {
        title: title.trim(),
        dueDate,
        priority,
        notes: notes.trim() || undefined,
      },
      initialData?.id
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-lg">
            <Flag className="w-5 h-5" />
            <span>{initialData ? '할 일 수정하기' : '새 할 일 등록'}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/20 text-white/90 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              할 일 제목 <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="예: 보고서 초안 검토, 정산 요청서 제출"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">마감 날짜</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">중요도</label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { level: 'high' as PriorityLevel, label: '상', active: 'bg-rose-500 text-white border-rose-500' },
                  { level: 'medium' as PriorityLevel, label: '중', active: 'bg-amber-500 text-white border-amber-500' },
                  { level: 'low' as PriorityLevel, label: '하', active: 'bg-emerald-500 text-white border-emerald-500' },
                ].map((p) => (
                  <button
                    type="button"
                    key={p.level}
                    onClick={() => setPriority(p.level)}
                    className={`py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                      priority === p.level
                        ? `${p.active} shadow-xs`
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">상세 메모 (선택)</label>
            <textarea
              rows={2}
              placeholder="세부 내용이나 참고 링크 등을 남기세요"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <div className="pt-3 flex items-center justify-between gap-3 border-t border-slate-100">
            {initialData && onDelete ? (
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('정말 이 할 일을 삭제하시겠습니까?')) {
                    onDelete(initialData.id);
                    onClose();
                  }
                }}
                className="px-3.5 py-2 rounded-xl text-rose-600 bg-rose-50 hover:bg-rose-100 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                삭제
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-bold transition-colors cursor-pointer"
              >
                취소
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all cursor-pointer"
              >
                {initialData ? '수정 완료' : '할 일 저장'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- MEMO MODAL ---
interface MemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Omit<MemoItem, 'id'>, id?: string) => void;
  onDelete?: (id: string) => void;
  initialData?: MemoItem | null;
  defaultDate?: string;
}

export const MemoModal: React.FC<MemoModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  initialData,
  defaultDate,
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [color, setColor] = useState('yellow');
  const [category, setCategory] = useState('아이디어');
  const [sticker, setSticker] = useState<string>('flower');
  const [pinned, setPinned] = useState(false);
  const [createdAt, setCreatedAt] = useState(defaultDate || getTodayDateString());

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setContent(initialData.content);
      setColor(initialData.color || 'yellow');
      setCategory(initialData.category || '아이디어');
      setSticker(initialData.sticker || 'flower');
      setPinned(Boolean(initialData.pinned));
      setCreatedAt(initialData.createdAt);
    } else {
      setTitle('');
      setContent('');
      setColor('yellow');
      setCategory('아이디어');
      setSticker('flower');
      setPinned(false);
      setCreatedAt(defaultDate || getTodayDateString());
    }
  }, [initialData, isOpen, defaultDate]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() && !content.trim()) return;
    onSave(
      {
        title: title.trim() || '메모',
        content: content.trim(),
        color,
        category,
        sticker: sticker === 'none' ? undefined : sticker,
        pinned,
        createdAt,
      },
      initialData?.id
    );
    onClose();
  };

  const memoColors = [
    { id: 'yellow', name: '버터 옐로우', bg: 'bg-[#FEF08A]', border: 'border-amber-300' },
    { id: 'pink', name: '스트로베리 핑크', bg: 'bg-[#FECDD3]', border: 'border-rose-300' },
    { id: 'mint', name: '민트 그린', bg: 'bg-[#A7F3D0]', border: 'border-emerald-300' },
    { id: 'blue', name: '스카이 블루', bg: 'bg-[#BAE6FD]', border: 'border-sky-300' },
    { id: 'purple', name: '라벤더 퍼플', bg: 'bg-[#DDD6FE]', border: 'border-purple-300' },
    { id: 'lilac', name: '블라썸 라일락', bg: 'bg-[#F5D0FE]', border: 'border-fuchsia-300' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-lg">
            <AlignLeft className="w-5 h-5" />
            <span>{initialData ? '자유 메모 수정' : '새 자유 메모 작성'}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/20 text-white/90 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700">
                메모 제목 <span className="text-rose-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => setPinned(!pinned)}
                className={`text-xs font-semibold flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  pinned ? 'bg-amber-100 text-amber-800' : 'text-slate-400 hover:text-slate-600 bg-slate-50'
                }`}
              >
                <Pin className={`w-3.5 h-3.5 ${pinned ? 'rotate-45 fill-amber-500 text-amber-700' : ''}`} />
                {pinned ? '상단 고정됨' : '상단 고정'}
              </button>
            </div>
            <input
              type="text"
              required
              placeholder="예: 프로젝트 아이디어, 주요 회의 메모"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 font-bold"
              autoFocus
            />
          </div>

          {/* Category selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">카테고리 분류</label>
            <div className="grid grid-cols-4 gap-1.5">
              {['아이디어', '업무', '회의록', '개인'].map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`py-1.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                    category === cat
                      ? 'bg-purple-600 text-white border-purple-600 shadow-2xs'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Sticker selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">다이어리 스티커 붙이기</label>
            <div className="flex flex-wrap items-center gap-2">
              {[
                { id: 'flower', label: '🌸 꽃' },
                { id: 'heart', label: '❤️ 하트' },
                { id: 'thankyou', label: '💌 감사' },
                { id: 'star', label: '⭐ 별' },
                { id: 'none', label: '스티커 없음' },
              ].map((stk) => (
                <button
                  type="button"
                  key={stk.id}
                  onClick={() => setSticker(stk.id)}
                  className={`px-3 py-1 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                    sticker === stk.id
                      ? 'bg-amber-100 border-amber-400 text-amber-900 shadow-2xs'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {stk.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">내용</label>
            <textarea
              rows={4}
              placeholder="기억해두어야 할 업무 내용, 회의 안건 등을 자유롭게 작성하세요..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 leading-relaxed resize-none"
              style={{
                backgroundImage: 'repeating-linear-gradient(transparent, transparent 21px, rgba(0, 0, 0, 0.04) 22px)',
                lineHeight: '22px',
              }}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">파스텔 메모지 색상</label>
            <div className="flex items-center gap-2.5">
              {memoColors.map((c) => (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => setColor(c.id)}
                  className={`w-7 h-7 rounded-xl ${c.bg} ${c.border} border-2 transition-transform cursor-pointer ${
                    color === c.id ? 'ring-2 ring-purple-600 scale-110' : 'opacity-80 hover:opacity-100'
                  }`}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          <div className="pt-3 flex items-center justify-between gap-3 border-t border-slate-100">
            {initialData && onDelete ? (
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('정말 이 메모를 삭제하시겠습니까?')) {
                    onDelete(initialData.id);
                    onClose();
                  }
                }}
                className="px-3.5 py-2 rounded-xl text-rose-600 bg-rose-50 hover:bg-rose-100 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                삭제
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-bold transition-colors cursor-pointer"
              >
                취소
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md shadow-purple-500/20 transition-all cursor-pointer"
              >
                {initialData ? '수정 완료' : '메모 저장'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};


// --- QUICK ADD MENU (Floating Action Button Drawer/Menu) ---
interface QuickAddMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectType: (type: 'schedule' | 'todo' | 'memo') => void;
}

export const QuickAddMenu: React.FC<QuickAddMenuProps> = ({
  isOpen,
  onClose,
  onSelectType,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs flex items-end sm:items-center justify-center p-4">
      <div
        className="bg-white w-full max-w-sm rounded-3xl p-5 shadow-2xl border border-slate-100 animate-in slide-in-from-bottom duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2 font-bold text-slate-900">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>무엇을 추가하시겠어요?</span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-full cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2.5">
          <button
            onClick={() => {
              onClose();
              onSelectType('schedule');
            }}
            className="w-full flex items-center gap-3.5 p-3.5 rounded-2xl bg-blue-50/70 hover:bg-blue-100/80 border border-blue-100 transition-all text-left group cursor-pointer"
          >
            <div className="w-11 h-11 rounded-xl bg-blue-500 text-white flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-slate-900 text-sm">새 일정 등록</div>
              <div className="text-xs text-slate-500 mt-0.5">회의, 미팅, 외근 등 시간대별 일정</div>
            </div>
          </button>

          <button
            onClick={() => {
              onClose();
              onSelectType('todo');
            }}
            className="w-full flex items-center gap-3.5 p-3.5 rounded-2xl bg-indigo-50/70 hover:bg-indigo-100/80 border border-indigo-100 transition-all text-left group cursor-pointer"
          >
            <div className="w-11 h-11 rounded-xl bg-indigo-500 text-white flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
              <Flag className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-slate-900 text-sm">새 할 일 등록</div>
              <div className="text-xs text-slate-500 mt-0.5">마감일과 중요도(상/중/하)가 있는 업무</div>
            </div>
          </button>

          <button
            onClick={() => {
              onClose();
              onSelectType('memo');
            }}
            className="w-full flex items-center gap-3.5 p-3.5 rounded-2xl bg-amber-50/70 hover:bg-amber-100/80 border border-amber-100 transition-all text-left group cursor-pointer"
          >
            <div className="w-11 h-11 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
              <AlignLeft className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-slate-900 text-sm">새 메모 작성</div>
              <div className="text-xs text-slate-500 mt-0.5">아이디어, 회의록 요약, 빠른 기록</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
