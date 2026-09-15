import React, { useState } from 'react';
import { Clock, MapPin, Plus, Calendar as CalendarIcon, Edit2, Trash2, Filter } from 'lucide-react';
import { ScheduleItem } from '../types';
import { getTodayDateString } from '../data/initialData';
import { StarCharacter } from './Characters';

interface ScheduleViewProps {
  schedules: ScheduleItem[];
  onOpenScheduleModal: (item?: ScheduleItem) => void;
  onDeleteSchedule: (id: string) => void;
}

export const ScheduleView: React.FC<ScheduleViewProps> = ({
  schedules,
  onOpenScheduleModal,
  onDeleteSchedule,
}) => {
  const today = getTodayDateString();
  const [selectedDate, setSelectedDate] = useState<string>('all'); // 'all', 'today', or specific date

  // Filter schedules
  const filteredSchedules = schedules.filter((sch) => {
    if (selectedDate === 'all') return true;
    if (selectedDate === 'today') return sch.date === today;
    return sch.date === selectedDate;
  });

  // Sort by date then startTime
  const sorted = [...filteredSchedules].sort((a, b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date);
    return a.startTime.localeCompare(b.startTime);
  });

  const getBorderColor = (color?: string) => {
    switch (color) {
      case 'purple':
        return 'border-l-purple-500 bg-purple-50/20';
      case 'amber':
        return 'border-l-amber-500 bg-amber-50/20';
      case 'emerald':
        return 'border-l-emerald-500 bg-emerald-50/20';
      case 'indigo':
        return 'border-l-indigo-500 bg-indigo-50/20';
      case 'blue':
      default:
        return 'border-l-blue-500 bg-blue-50/20';
    }
  };

  return (
    <div className="space-y-5 pb-24">
      {/* Header card */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-sm relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
              <CalendarIcon className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                일정 관리
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200">
                  총 {schedules.length}건
                </span>
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">회의, 미팅, 외근 등 비즈니스 스케줄을 체계적으로 관리하세요</p>
            </div>
          </div>

          <button
            onClick={() => onOpenScheduleModal()}
            className="self-start sm:self-auto px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>새 일정 등록</span>
          </button>
        </div>

        {/* Filter bar */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold">
            <button
              onClick={() => setSelectedDate('all')}
              className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                selectedDate === 'all'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              전체 일정
            </button>
            <button
              onClick={() => setSelectedDate('today')}
              className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                selectedDate === 'today'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              오늘 ({today})
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium">날짜 선택:</span>
            <input
              type="date"
              value={selectedDate === 'all' || selectedDate === 'today' ? '' : selectedDate}
              onChange={(e) => {
                if (e.target.value) {
                  setSelectedDate(e.target.value);
                } else {
                  setSelectedDate('all');
                }
              }}
              className="px-2.5 py-1 rounded-xl border border-slate-200 text-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>
        </div>
      </div>

      {/* Schedule list */}
      {sorted.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 border border-slate-100 shadow-sm text-center">
          <div className="inline-block mb-3">
            <StarCharacter size={64} />
          </div>
          <h3 className="text-base font-bold text-slate-800">해당 날짜에 일정이 없습니다</h3>
          <p className="text-xs text-slate-400 mt-1">새로운 회의나 외근 일정을 추가하여 하루를 계획해보세요.</p>
          <button
            onClick={() => onOpenScheduleModal()}
            className="mt-4 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" /> 지금 일정 추가하기
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map((sch) => (
            <div
              key={sch.id}
              className={`bg-white rounded-3xl p-4 sm:p-5 border border-slate-100 border-l-4 ${getBorderColor(
                sch.color
              )} shadow-xs hover:shadow-md transition-all group`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-lg bg-blue-50 border border-blue-100 text-blue-700 text-xs font-extrabold flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {sch.startTime} ~ {sch.endTime}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      {sch.date} {sch.date === today && <b className="text-blue-600 font-bold ml-1">(오늘)</b>}
                    </span>
                  </div>

                  <h3 className="text-base font-black text-slate-800">
                    {sch.title}
                  </h3>

                  {sch.location && (
                    <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      <span>{sch.location}</span>
                    </div>
                  )}

                  {sch.notes && (
                    <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 whitespace-pre-line">
                      {sch.notes}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-1.5 self-end sm:self-start pt-2 sm:pt-0">
                  <button
                    onClick={() => onOpenScheduleModal(sch)}
                    className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors cursor-pointer"
                    title="수정"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm('이 일정을 삭제할까요?')) {
                        onDeleteSchedule(sch.id);
                      }
                    }}
                    className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                    title="삭제"
                  >
                    <Trash2 className="w-4 h-4" />
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
