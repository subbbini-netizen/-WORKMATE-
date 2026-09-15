import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Plus, 
  Check, 
  Clock, 
  MapPin, 
  Edit2, 
  Trash2, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { ScheduleItem, TodoItem, PriorityLevel } from '../types';
import { getTodayDateString } from '../data/initialData';
import { CloudCharacter, StarCharacter, EggCharacter, OrangeBlobCharacter } from './Characters';

interface CalendarViewProps {
  schedules: ScheduleItem[];
  todos: TodoItem[];
  onToggleTodo: (id: string) => void;
  onOpenScheduleModal: (item?: ScheduleItem, defaultDate?: string) => void;
  onOpenTodoModal: (item?: TodoItem, defaultDate?: string) => void;
  onDeleteSchedule: (id: string) => void;
  onDeleteTodo: (id: string) => void;
  onAddQuickTodo: (title: string, priority: PriorityLevel, dueDate: string) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  schedules,
  todos,
  onToggleTodo,
  onOpenScheduleModal,
  onOpenTodoModal,
  onDeleteSchedule,
  onDeleteTodo,
  onAddQuickTodo,
}) => {

  const todayStr = getTodayDateString();
  const todayDate = new Date(todayStr);

  // Calendar navigation state (year & month, 0-indexed month)
  const [currentYear, setCurrentYear] = useState<number>(todayDate.getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(todayDate.getMonth()); // 0 = Jan, 8 = Sep
  const [selectedDateStr, setSelectedDateStr] = useState<string>(todayStr);

  // Quick inline inputs for selected date
  const [quickTaskTitle, setQuickTaskTitle] = useState('');
  const [quickTaskPriority, setQuickTaskPriority] = useState<PriorityLevel>('medium');

  // Month navigation helpers
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleGoToday = () => {
    setCurrentYear(todayDate.getFullYear());
    setCurrentMonth(todayDate.getMonth());
    setSelectedDateStr(todayStr);
  };

  // Generate Calendar Days (Monday to Sunday)
  const getCalendarDays = () => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);

    // Monday-based indexing: Sunday=6, Monday=0, Tuesday=1, etc.
    const startDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7;
    const totalDaysInMonth = lastDayOfMonth.getDate();

    // Previous month padding
    const prevMonthLastDay = new Date(currentYear, currentMonth, 0).getDate();
    const prevDays = [];
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const dayNum = prevMonthLastDay - i;
      const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      const dateStr = `${prevYear}-${String(prevMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
      prevDays.push({ dayNum, dateStr, isCurrentMonth: false });
    }

    // Current month days
    const currentDays = [];
    for (let day = 1; day <= totalDaysInMonth; day++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      currentDays.push({ dayNum: day, dateStr, isCurrentMonth: true });
    }

    // Next month padding to fill out 35 or 42 grid cells
    const remainingCells = (7 - ((prevDays.length + currentDays.length) % 7)) % 7;
    const nextDays = [];
    for (let day = 1; day <= remainingCells; day++) {
      const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
      const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;
      const dateStr = `${nextYear}-${String(nextMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      nextDays.push({ dayNum: day, dateStr, isCurrentMonth: false });
    }

    return [...prevDays, ...currentDays, ...nextDays];
  };

  const calendarDays = getCalendarDays();

  // Selected date's items
  const selectedSchedules = schedules
    .filter((s) => s.date === selectedDateStr)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const selectedTodos = todos
    .filter((t) => t.dueDate === selectedDateStr)
    .sort((a, b) => (a.completed === b.completed ? 0 : a.completed ? 1 : -1));

  // Selected date formatted in Korean
  const selectedDateObj = new Date(selectedDateStr);
  const weekDaysKorean = ['일', '월', '화', '수', '목', '금', '토'];
  const selectedDateFormatted = `${selectedDateObj.getMonth() + 1}월 ${selectedDateObj.getDate()}일 (${weekDaysKorean[selectedDateObj.getDay()]})`;

  const handleAddQuickTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTaskTitle.trim()) return;
    onAddQuickTodo(quickTaskTitle.trim(), quickTaskPriority, selectedDateStr);
    setQuickTaskTitle('');
  };

  return (
    <div className="space-y-6 pb-24">
      {/* 1. MONTHLY CALENDAR CARD (Reflecting IMG_2707 & IMG_2712) */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-100 shadow-sm relative overflow-hidden">
        {/* Top Month Header Controls */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center font-black shadow-2xs">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                <span>{currentYear}. {String(currentMonth + 1).padStart(2, '0')}</span>
                {todayDate.getFullYear() === currentYear && todayDate.getMonth() === currentMonth && (
                  <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-200">
                    이번 달
                  </span>
                )}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleGoToday}
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors cursor-pointer"
            >
              오늘
            </button>
            <div className="flex items-center bg-slate-100/80 p-1 rounded-xl border border-slate-200/60">
              <button
                onClick={handlePrevMonth}
                className="p-1 rounded-lg hover:bg-white text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer"
                title="이전 달"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextMonth}
                className="p-1 rounded-lg hover:bg-white text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer"
                title="다음 달"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Calendar Day-of-Week Headers - strictly Korean as requested */}
        <div className="grid grid-cols-7 gap-1 text-center font-bold text-xs text-slate-400 mb-2">
          {['월', '화', '수', '목', '금', '토', '일'].map((day, idx) => (
            <div
              key={day}
              className={`py-1.5 ${idx >= 5 ? 'text-rose-400 font-extrabold' : ''}`}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days Grid */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {calendarDays.map((item, index) => {
            const isSelected = item.dateStr === selectedDateStr;
            const isToday = item.dateStr === todayStr;

            // Check events on this date
            const daySchedules = schedules.filter((s) => s.date === item.dateStr);
            const dayTodos = todos.filter((t) => t.dueDate === item.dateStr);

            const hasSchedule = daySchedules.length > 0;
            const hasTodo = dayTodos.length > 0;

            return (
              <button
                key={`${item.dateStr}-${index}`}
                type="button"
                onClick={() => setSelectedDateStr(item.dateStr)}
                className={`flex flex-col items-center justify-between p-1.5 sm:p-2.5 rounded-2xl min-h-[56px] sm:min-h-[64px] transition-all cursor-pointer relative ${
                  isSelected
                    ? 'bg-gradient-to-b from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-500/30 scale-[1.03] z-10'
                    : isToday
                    ? 'bg-blue-50/70 border border-blue-300 text-blue-800 hover:bg-blue-100/70'
                    : item.isCurrentMonth
                    ? 'bg-white hover:bg-slate-50 border border-slate-100 text-slate-800 hover:border-indigo-100'
                    : 'bg-slate-50/40 text-slate-300 hover:bg-slate-100/50'
                }`}
              >
                {/* Day number */}
                <span
                  className={`text-xs sm:text-sm font-black ${
                    isSelected ? 'text-white' : item.isCurrentMonth ? 'text-slate-800' : 'text-slate-300'
                  }`}
                >
                  {item.dayNum}
                </span>

                {/* Event indicator dots (matching IMG_2707.png & IMG_2712.jpeg) */}
                <div className="flex items-center gap-1 mt-1 min-h-[6px]">
                  {hasSchedule && (
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isSelected ? 'bg-sky-200' : 'bg-blue-500'
                      }`}
                      title="일정 있음"
                    />
                  )}
                  {hasTodo && (
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isSelected ? 'bg-amber-200' : 'bg-rose-500'
                      }`}
                      title="할 일 있음"
                    />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs font-semibold text-slate-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500" /> 일정
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500" /> 할 일
            </span>
          </div>
        </div>
      </div>

      {/* 2. SELECTED DATE SECTION HEADER */}
      <div className="flex items-center justify-between gap-2 bg-gradient-to-r from-purple-50/90 via-indigo-50/70 to-blue-50/90 px-4 py-3 sm:px-5 rounded-2xl border border-purple-100/80">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#7C3AED] text-white flex items-center justify-center font-black shadow-2xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-[#7C3AED]">
              {selectedDateStr === todayStr ? '오늘' : '선택'}
            </div>
            <h3 className="text-base font-black text-slate-900">
              {selectedDateFormatted}
            </h3>
          </div>
        </div>

        {/* Quick action buttons for this selected date */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onOpenScheduleModal(undefined, selectedDateStr)}
            className="px-2.5 py-1.5 rounded-xl bg-white border border-blue-200 text-blue-700 hover:bg-blue-50 text-xs font-bold transition-all flex items-center gap-1 shadow-2xs cursor-pointer"
            title="일정 추가"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">일정</span>
          </button>
          <button
            onClick={() => onOpenTodoModal(undefined, selectedDateStr)}
            className="px-2.5 py-1.5 rounded-xl bg-white border border-purple-200 text-purple-700 hover:bg-purple-50 text-xs font-bold transition-all flex items-center gap-1 shadow-2xs cursor-pointer"
            title="할 일 추가"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">할 일</span>
          </button>
        </div>
      </div>

      {/* 3. DAILY TASKS & SCHEDULE CARD (Dedicated single card, no memo) */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-sm relative overflow-hidden">
        {/* Cloud mascot on the card edge */}
        <div className="absolute -top-3 -right-1 pointer-events-none z-10">
          <CloudCharacter size={56} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-4 pr-12">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-purple-100 text-[#7C3AED] flex items-center justify-center font-bold">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-base font-black text-slate-800">
                  할 일 & 일정
                </h4>
                <p className="text-[11px] text-slate-400">선택한 날짜의 상세 일정과 체크리스트</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onOpenScheduleModal(undefined, selectedDateStr)}
                className="text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-xl border border-blue-200 transition-colors cursor-pointer"
                title="일정 추가"
              >
                + 일정
              </button>
              <button
                onClick={() => onOpenTodoModal(undefined, selectedDateStr)}
                className="text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 px-2.5 py-1 rounded-xl border border-purple-200 transition-colors cursor-pointer"
                title="할 일 추가"
              >
                + 할 일
              </button>
            </div>
          </div>

          {/* Quick inline Task Form */}
          <form onSubmit={handleAddQuickTask} className="mb-4">
            <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-200 focus-within:border-purple-400">
              <input
                type="text"
                placeholder="오늘 할 일 빠른 입력..."
                value={quickTaskTitle}
                onChange={(e) => setQuickTaskTitle(e.target.value)}
                className="flex-1 px-3 py-1 text-xs sm:text-sm bg-transparent border-none text-slate-800 placeholder-slate-400 focus:outline-none font-medium"
              />
              <select
                value={quickTaskPriority}
                onChange={(e) => setQuickTaskPriority(e.target.value as PriorityLevel)}
                className="text-xs font-bold bg-white border border-slate-200 px-2 py-1 rounded-lg text-slate-700 focus:outline-none"
              >
                <option value="high">중요도: 상</option>
                <option value="medium">중요도: 중</option>
                <option value="low">중요도: 하</option>
              </select>
              <button
                type="submit"
                className="px-3 py-1.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold rounded-xl shrink-0 cursor-pointer shadow-2xs"
              >
                등록
              </button>
            </div>
          </form>

          {/* Schedules Section (if any) */}
          {selectedSchedules.length > 0 && (
            <div className="mb-4 space-y-2">
              <div className="text-xs font-extrabold text-blue-700 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>일정 ({selectedSchedules.length})</span>
              </div>
              <div className="space-y-1.5">
                {selectedSchedules.map((sch) => (
                  <div
                    key={sch.id}
                    className="p-3 rounded-2xl border border-blue-100 bg-blue-50/50 flex items-center justify-between text-xs group hover:bg-blue-50 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1 mr-2">
                      <span className="font-black text-blue-700 bg-white px-2 py-1 rounded-lg border border-blue-200 text-xs shrink-0">
                        {sch.startTime} - {sch.endTime}
                      </span>
                      <span className="font-bold text-slate-800 truncate">{sch.title}</span>
                      {sch.location && (
                        <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-slate-400 truncate">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {sch.location}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => onOpenScheduleModal(sch, selectedDateStr)}
                        className="p-1 text-slate-400 hover:text-blue-600 cursor-pointer"
                        title="수정"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm('이 일정을 삭제할까요?')) onDeleteSchedule(sch.id);
                        }}
                        className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                        title="삭제"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Todos Section */}
          <div className="space-y-2">
            <div className="text-xs font-extrabold text-purple-700 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>할 일 목록 ({selectedTodos.length})</span>
            </div>

            {selectedTodos.length === 0 && selectedSchedules.length === 0 ? (
              <div className="py-8 px-4 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 my-1">
                <p className="text-xs font-bold text-slate-600">등록된 일정과 할 일이 없습니다.</p>
                <p className="text-[11px] text-slate-400 mt-1">상단의 입력창이나 버튼으로 새 일정을 등록해보세요.</p>
              </div>
            ) : selectedTodos.length === 0 ? (
              <div className="py-4 px-4 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 my-1">
                <p className="text-xs font-bold text-slate-500">등록된 할 일이 없습니다.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {selectedTodos.map((todo, idx) => (
                  <div
                    key={todo.id}
                    className={`flex items-center justify-between p-3 rounded-2xl border transition-all group ${
                      todo.completed
                        ? 'bg-slate-50/80 border-slate-200 text-slate-400'
                        : 'bg-white border-slate-200 hover:border-purple-200 text-slate-800 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1 mr-2">
                      {idx === 0 && todo.priority === 'high' && !todo.completed && (
                        <OrangeBlobCharacter size={24} className="shrink-0" />
                      )}

                      <button
                        type="button"
                        onClick={() => onToggleTodo(todo.id)}
                        className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 cursor-pointer transition-colors ${
                          todo.completed
                            ? 'bg-emerald-500 text-white'
                            : 'border-2 border-slate-300 hover:border-purple-500 bg-white'
                        }`}
                      >
                        {todo.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </button>
                      <span
                        onClick={() => onToggleTodo(todo.id)}
                        className={`text-xs sm:text-sm font-bold truncate cursor-pointer ${
                          todo.completed ? 'line-through text-slate-400' : 'text-slate-800'
                        }`}
                      >
                        {todo.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                          todo.priority === 'high'
                            ? 'bg-rose-50 text-rose-600'
                            : todo.priority === 'medium'
                            ? 'bg-amber-50 text-amber-600'
                            : 'bg-emerald-50 text-emerald-600'
                        }`}
                      >
                        {todo.priority === 'high' ? '상' : todo.priority === 'medium' ? '중' : '하'}
                      </span>

                      <div className="flex items-center gap-1 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => onOpenTodoModal(todo, selectedDateStr)}
                          className="p-1 text-slate-400 hover:text-purple-600 cursor-pointer"
                          title="수정"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm('이 할 일을 삭제할까요?')) onDeleteTodo(todo.id);
                          }}
                          className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
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
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
          <span>
            {selectedTodos.filter((t) => t.completed).length} / {selectedTodos.length} 완료
          </span>
          <button
            onClick={() => onOpenTodoModal(undefined, selectedDateStr)}
            className="text-purple-600 font-bold hover:underline cursor-pointer"
          >
            + 새 할 일 추가
          </button>
        </div>
      </div>
    </div>
  );
};
