import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { Clock, MapPin, User, Calendar } from 'lucide-react';

export const TimetableView: React.FC = () => {
  const { timetable } = useSchool();
  const [selectedDay, setSelectedDay] = useState<string>('Monday');
  const [selectedGrade, setSelectedGrade] = useState<string>('Grade 10');

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const slotsForDay = timetable.filter(
    (slot) => slot.dayOfWeek === selectedDay && slot.grade === selectedGrade
  );

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Class Timetable & Master Schedule
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Institutional period assignments, faculty lecture slots, and classroom laboratory allocations.
          </p>
        </div>

        {/* Grade filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Select Cohort:</span>
          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="Grade 10">Grade 10 - Stream A</option>
            <option value="Grade 11">Grade 11 - Stream A</option>
            <option value="Grade 12">Grade 12 - Stream A</option>
          </select>
        </div>
      </div>

      {/* Day Selector Segmented Bar */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl max-w-xl">
        {daysOfWeek.map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              selectedDay === day
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Period Schedule Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {slotsForDay.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-400 bg-white border border-slate-200/80 rounded-xl">
            No scheduled lectures configured for {selectedDay} in {selectedGrade}.
          </div>
        ) : (
          slotsForDay.map((slot, index) => {
            const isFirst = index === 0;
            return (
              <div
                key={slot.id}
                className={`p-5 rounded-xl border transition-all ${
                  isFirst
                    ? 'bg-indigo-50/40 border-indigo-200 shadow-xs'
                    : 'bg-white border-slate-200/80 shadow-xs hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-md bg-slate-900 text-white text-[11px] font-bold flex items-center justify-center">
                      P{slot.period}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      Period {slot.period}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-mono tabular-nums text-slate-600">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{slot.timeRange}</span>
                  </div>
                </div>

                <div className="mt-3.5">
                  <h3 className="text-sm font-bold text-slate-900">
                    {slot.subject}
                  </h3>

                  <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>{slot.teacherName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-medium text-slate-800">{slot.room}</span>
                    </div>
                  </div>
                </div>

                {isFirst && (
                  <div className="mt-4 pt-3 border-t border-indigo-100 flex items-center justify-between text-[11px] text-indigo-700 font-semibold">
                    <span>Morning Session</span>
                    <span>Starts 08:30 AM</span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Bell Schedule Information Footer */}
      <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-600 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-indigo-600" />
          <span className="font-semibold text-slate-800">JOOUST Academic Lecture Schedule:</span>
          <span>Morning Assembly 08:15 · Lunch Break 12:15 - 13:00 · Dismissal Bell 15:35</span>
        </div>
        <div className="text-[11px] text-slate-500">
          50-minute instructional blocks with 5-minute passing intervals.
        </div>
      </div>
    </div>
  );
};
