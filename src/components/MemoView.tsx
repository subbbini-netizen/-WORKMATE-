import React, { useState } from 'react';
import { 
  AlignLeft, 
  Plus, 
  Search, 
  Pin, 
  Copy, 
  Edit2, 
  Trash2, 
  Check, 
  Sparkles 
} from 'lucide-react';
import { MemoItem } from '../types';
import { PencilBlob, FlowerSticker, HeartSticker, ThankYouSticker, StarSticker } from './Characters';

interface MemoViewProps {
  memos: MemoItem[];
  onOpenMemoModal: (item?: MemoItem) => void;
  onDeleteMemo: (id: string) => void;
  onTogglePin: (id: string) => void;
}

export const MemoView: React.FC<MemoViewProps> = ({
  memos,
  onOpenMemoModal,
  onDeleteMemo,
  onTogglePin,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [colorFilter, setColorFilter] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = memos.filter((memo) => {
    const matchesSearch =
      memo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      memo.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesColor = colorFilter === 'all' || memo.color === colorFilter;
    return matchesSearch && matchesColor;
  });

  // Sort: Pinned first, then by date/title
  const sorted = [...filtered].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return b.createdAt.localeCompare(a.createdAt);
  });

  const handleCopy = (memo: MemoItem) => {
    navigator.clipboard.writeText(`${memo.title}\n\n${memo.content}`);
    setCopiedId(memo.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getColorStyles = (color?: string) => {
    switch (color) {
      case 'blue':
        return {
          card: 'bg-blue-50/90 border-blue-200 text-blue-950 hover:border-blue-300',
          badge: 'bg-blue-100 text-blue-800',
          header: 'border-blue-200/60'
        };
      case 'purple':
        return {
          card: 'bg-purple-50/90 border-purple-200 text-purple-950 hover:border-purple-300',
          badge: 'bg-purple-100 text-purple-800',
          header: 'border-purple-200/60'
        };
      case 'green':
        return {
          card: 'bg-emerald-50/90 border-emerald-200 text-emerald-950 hover:border-emerald-300',
          badge: 'bg-emerald-100 text-emerald-800',
          header: 'border-emerald-200/60'
        };
      case 'pink':
        return {
          card: 'bg-pink-50/90 border-pink-200 text-pink-950 hover:border-pink-300',
          badge: 'bg-pink-100 text-pink-800',
          header: 'border-pink-200/60'
        };
      case 'yellow':
      default:
        return {
          card: 'bg-amber-50/90 border-amber-200 text-amber-950 hover:border-amber-300',
          badge: 'bg-amber-100 text-amber-800',
          header: 'border-amber-200/60'
        };
    }
  };

  return (
    <div className="space-y-5 pb-24">
      {/* Header card */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
              <AlignLeft className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                업무 메모 & 아이디어
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                  {memos.length}개 보관 중
                </span>
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">자유로운 빠른 기록, 회의록 요약, 아이디어를 남겨두세요</p>
            </div>
          </div>

          <button
            onClick={() => onOpenMemoModal()}
            className="self-start sm:self-auto px-4 py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md shadow-amber-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>새 메모 작성</span>
          </button>
        </div>

        {/* Search and filters */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Search input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="메모 제목 또는 본문 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Color tag filters */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-400 text-[11px] font-medium mr-1">색상:</span>
            {[
              { id: 'all', label: '전체' },
              { id: 'yellow', label: '노랑' },
              { id: 'blue', label: '파랑' },
              { id: 'green', label: '초록' },
              { id: 'purple', label: '보라' },
              { id: 'pink', label: '분홍' },
            ].map((c) => (
              <button
                key={c.id}
                onClick={() => setColorFilter(c.id)}
                className={`px-2 py-1 rounded-lg border text-xs transition-all cursor-pointer ${
                  colorFilter === c.id
                    ? 'bg-amber-600 text-white border-amber-600 font-bold'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Memos grid */}
      {sorted.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 border border-slate-100 shadow-sm text-center">
          <div className="inline-block mb-3">
            <PencilBlob size={64} />
          </div>
          <h3 className="text-base font-bold text-slate-800">
            {searchQuery ? '검색 결과가 없습니다' : '작성된 메모가 없습니다'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {searchQuery ? '다른 검색어를 입력해보세요' : '새로운 아이디어나 중요한 회의 내용을 기록해보세요.'}
          </p>
          {!searchQuery && (
            <button
              onClick={() => onOpenMemoModal()}
              className="mt-4 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" /> 지금 메모 작성하기
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sorted.map((memo) => {
            const styles = getColorStyles(memo.color);
            return (
              <div
                key={memo.id}
                className={`rounded-3xl p-5 border transition-all shadow-2xs hover:shadow-md flex flex-col justify-between group ${styles.card}`}
              >
                <div className="relative">
                  {/* Category Pill and Sticker */}
                  {memo.sticker === 'flower' && <FlowerSticker size={38} className="absolute -top-3 -right-2 pointer-events-none z-10" />}
                  {memo.sticker === 'heart' && <HeartSticker size={34} className="absolute -top-3 -right-2 pointer-events-none z-10" />}
                  {memo.sticker === 'thankyou' && <ThankYouSticker size={48} className="absolute -top-3 -right-2 pointer-events-none z-10" />}
                  {memo.sticker === 'star' && <StarSticker size={32} className="absolute -top-3 -right-2 pointer-events-none z-10" />}

                  {/* Top bar with pin & actions */}
                  <div className={`flex items-start justify-between gap-2 pb-2.5 mb-2.5 border-b ${styles.header}`}>
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <button
                        onClick={() => onTogglePin(memo.id)}
                        className={`p-1 rounded-lg transition-colors cursor-pointer ${
                          memo.pinned ? 'text-amber-700 bg-amber-200/70' : 'text-slate-400 hover:text-slate-600'
                        }`}
                        title={memo.pinned ? '고정 해제' : '상단 고정'}
                      >
                        <Pin className="w-4 h-4" />
                      </button>
                      <div className="flex items-center gap-1.5 min-w-0">
                        {memo.category && (
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-white/80 border border-black/5 text-purple-800 shrink-0">
                            {memo.category}
                          </span>
                        )}
                        <h3 className="font-extrabold text-base leading-snug truncate">
                          {memo.title}
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleCopy(memo)}
                        className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-black/5 transition-colors cursor-pointer"
                        title="내용 복사"
                      >
                        {copiedId === memo.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <button
                        onClick={() => onOpenMemoModal(memo)}
                        className="p-1.5 text-slate-500 hover:text-blue-600 rounded-lg hover:bg-black/5 transition-colors cursor-pointer"
                        title="수정"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm('이 메모를 삭제할까요?')) {
                            onDeleteMemo(memo.id);
                          }
                        }}
                        className="p-1.5 text-slate-500 hover:text-rose-600 rounded-lg hover:bg-black/5 transition-colors cursor-pointer"
                        title="삭제"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Memo Content */}
                  <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-line opacity-90 pb-3">
                    {memo.content}
                  </div>
                </div>

                {/* Footer date */}
                <div className="pt-2 border-t border-black/5 flex items-center justify-between text-[11px] opacity-65">
                  <span>작성일: {memo.createdAt}</span>
                  {memo.pinned && (
                    <span className="font-bold text-amber-700 flex items-center gap-1">
                      <Pin className="w-3 h-3" /> 상단 고정
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
