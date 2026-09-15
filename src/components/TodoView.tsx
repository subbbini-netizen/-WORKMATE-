import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Plus, 
  Flag, 
  Check, 
  Edit2, 
  Trash2, 
  Filter, 
  Calendar as CalendarIcon,
  Sparkles
} from 'lucide-react';
import { TodoItem, PriorityLevel } from '../types';
import { getTodayDateString } from '../data/initialData';
import { CloudCharacter } from './Characters';

interface TodoViewProps {
  todos: TodoItem[];
  onToggleTodo: (id: string) => void;
  onAddQuickTodo: (title: string, priority: PriorityLevel) => void;
  onOpenTodoModal: (item?: TodoItem) => void;
  onDeleteTodo: (id: string) => void;
}

export const TodoView: React.FC<TodoViewProps> = ({
  todos,
  onToggleTodo,
  onAddQuickTodo,
  onOpenTodoModal,
  onDeleteTodo,
}) => {
  const [quickTitle, setQuickTitle] = useState('');
  const [quickPriority, setQuickPriority] = useState<PriorityLevel>('medium');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | PriorityLevel>('all');

  const today = getTodayDateString();

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;
    onAddQuickTodo(quickTitle.trim(), quickPriority);
    setQuickTitle('');
  };

  // Filter
  const filtered = todos.filter((t) => {
    if (statusFilter === 'active' && t.completed) return false;
    if (statusFilter === 'completed' && !t.completed) return false;
    if (priorityFilter !== 'all' && t.priority !== priorityFilter) return false;
    return true;
  });

  // Sort
  const priorityWeight: Record<PriorityLevel, number> = { high: 3, medium: 2, low: 1 };
  const sorted = [...filtered].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    return priorityWeight[b.priority] - priorityWeight[a.priority];
  });

  const completedCount = todos.filter(t => t.completed).length;
  const totalCount = todos.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const getPriorityTag = (p: PriorityLevel) => {
    switch (p) {
      case 'high':
        return (
          <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-600 border border-rose-200">
            상
          </span>
        );
      case 'medium':
        return (
          <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-600 border border-amber-200">
            중
          </span>
        );
      case 'low':
        return (
          <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
            하
          </span>
        );
    }
  };

  return (
    <div className="space-y-5 pb-24">
      {/* Header card */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                할 일 관리
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-200">
                  완료 {completedCount} / 전체 {totalCount}
                </span>
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">우선순위와 마감일을 체크하며 효율적으로 업무를 완수하세요</p>
            </div>
          </div>

          <button
            onClick={() => onOpenTodoModal()}
            className="self-start sm:self-auto px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>상세 할 일 등록</span>
          </button>
        </div>

        {/* Quick inline add input */}
        <form onSubmit={handleQuickSubmit} className="mt-5 relative">
          <div className="flex flex-col sm:flex-row items-stretch gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
            <input
              type="text"
              placeholder="오늘 집중할 할 일을 입력하세요 (예: 보고서 검토, 회의 준비)"
              value={quickTitle}
              onChange={(e) => setQuickTitle(e.target.value)}
              className="flex-1 px-3 py-2 text-sm bg-transparent border-none text-slate-800 placeholder-slate-400 focus:outline-none font-medium"
            />
            
            <div className="flex items-center gap-1.5 justify-end">
              <select
                value={quickPriority}
                onChange={(e) => setQuickPriority(e.target.value as PriorityLevel)}
                className="text-xs font-bold bg-white border border-slate-200 px-2 py-2 rounded-xl text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="high">중요도: 상</option>
                <option value="medium">중요도: 중</option>
                <option value="low">중요도: 하</option>
              </select>

              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1 shrink-0 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>추가</span>
              </button>
            </div>
          </div>
        </form>

        {/* Filter bar */}
        <div className="mt-4 pt-3.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          {/* Status filter */}
          <div className="flex items-center gap-1 text-xs font-semibold">
            {[
              { id: 'all', label: '전체' },
              { id: 'active', label: `진행 중 (${todos.filter(t => !t.completed).length})` },
              { id: 'completed', label: `완료됨 (${completedCount})` },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setStatusFilter(f.id as any)}
                className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                  statusFilter === f.id
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Priority filter */}
          <div className="flex items-center gap-1 text-xs font-semibold">
            <span className="text-slate-400 text-[11px] mr-1">중요도:</span>
            {[
              { id: 'all', label: '전체' },
              { id: 'high', label: '상' },
              { id: 'medium', label: '중' },
              { id: 'low', label: '하' },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setPriorityFilter(p.id as any)}
                className={`px-2.5 py-1 rounded-lg border text-xs transition-all cursor-pointer ${
                  priorityFilter === p.id
                    ? 'bg-slate-800 text-white border-slate-800'
                    : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Todo list */}
      {sorted.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 border border-slate-100 shadow-sm text-center">
          <div className="inline-block mb-3">
            <CloudCharacter size={68} />
          </div>
          <h3 className="text-base font-bold text-slate-800">해당 조건의 할 일이 없습니다</h3>
          <p className="text-xs text-slate-400 mt-1">상단 입력창에서 바로 할 일을 등록해보세요!</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {sorted.map((todo) => (
            <div
              key={todo.id}
              className={`bg-white rounded-2xl p-3.5 sm:p-4 border transition-all flex items-center justify-between group ${
                todo.completed
                  ? 'bg-slate-50/70 border-slate-200/70 text-slate-400'
                  : 'border-slate-200 hover:border-indigo-300 hover:shadow-xs text-slate-800'
              }`}
            >
              {/* Checkbox and text */}
              <div className="flex items-center gap-3.5 min-w-0 flex-1 mr-3">
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
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      onClick={() => onToggleTodo(todo.id)}
                      className={`text-sm font-bold truncate cursor-pointer transition-all ${
                        todo.completed ? 'line-through text-slate-400' : 'text-slate-800'
                      }`}
                    >
                      {todo.title}
                    </span>
                  </div>
                  {todo.notes && (
                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{todo.notes}</p>
                  )}
                </div>
              </div>

              {/* Right side info & actions */}
              <div className="flex items-center gap-2 shrink-0">
                <div className="hidden sm:flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                  <CalendarIcon className="w-3 h-3 text-slate-400" />
                  <span>{todo.dueDate}</span>
                  {todo.dueDate === today && (
                    <span className="text-indigo-600 font-bold ml-1">(오늘)</span>
                  )}
                </div>

                {getPriorityTag(todo.priority)}

                <div className="flex items-center gap-1 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => onOpenTodoModal(todo)}
                    className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
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
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
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
  );
};
