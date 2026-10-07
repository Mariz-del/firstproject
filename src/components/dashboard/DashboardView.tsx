import React from 'react';
import { useSchool } from '../../context/SchoolContext';
import { CAMPUS_IMAGE_PATH } from '../../data/initialData';
import { formatKES } from '../../utils/currency';
import {
  Users,
  CalendarCheck,
  CreditCard,
  GraduationCap,
  ArrowRight,
  Clock,
  Sparkles,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  FileText,
  UserPlus,
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    currentUser,
    currentRole,
    stats,
    setActiveTab,
    students,
    notices,
    timetable,
    invoices,
    setIsEnrollModalOpen,
    setIsCreateNoticeModalOpen,
    setSelectedStudentForReportCard,
  } = useSchool();

  // Find Liam Chen if student/parent role
  const liamStudent = students.find((s) => s.id === 'std-1004') || students[0];

  const todayClasses = timetable.filter((t) => t.dayOfWeek === 'Monday').slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Institutional Hero Banner with Campus Image */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-900 text-white shadow-sm">
        <img
          src={CAMPUS_IMAGE_PATH}
          alt="JOOUST Bondo Main Campus"
          className="absolute inset-0 w-full h-full object-cover opacity-25"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-slate-900/40" />

        <div className="relative z-10 p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-300">
              <span>Fall Semester 2026</span>
              <span aria-hidden="true">·</span>
              <span>Academic Week 6</span>
              <span aria-hidden="true">·</span>
              <span>Bell Schedule: Normal</span>
            </div>
            <h1 className="mt-2 text-2xl md:text-3xl font-extrabold tracking-tight text-white">
              Welcome back, {currentUser.name}
            </h1>
            <p className="mt-1.5 text-xs md:text-sm text-slate-300 leading-relaxed">
              {currentRole === 'admin' &&
                'All 4 academic divisions are in session. 12 classes running with 96.4% on-time attendance today.'}
              {currentRole === 'teacher' &&
                'You have 3 scheduled lectures today. Grade 10-A Algebra problem sets are ready for review.'}
              {currentRole === 'student' &&
                'You are enrolled in Grade 10-A. Your next lecture is Chemistry Laboratory at 09:25 AM in Lab 3.'}
              {currentRole === 'parent' &&
                'Viewing academic progress and fee statements for Maya Chen (Grade 10-A). All tuition is up to date.'}
            </p>
          </div>

          {/* Quick Action cluster */}
          <div className="flex flex-wrap items-center gap-2.5">
            {currentRole === 'admin' && (
              <>
                <button
                  onClick={() => setIsEnrollModalOpen(true)}
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Enroll New Student</span>
                </button>
                <button
                  onClick={() => setActiveTab('attendance')}
                  className="px-4 py-2 text-xs font-semibold text-slate-900 bg-white hover:bg-slate-100 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
                >
                  <CalendarCheck className="w-4 h-4 text-indigo-600" />
                  <span>Take Attendance</span>
                </button>
              </>
            )}
            {currentRole === 'teacher' && (
              <>
                <button
                  onClick={() => setActiveTab('attendance')}
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
                >
                  <CalendarCheck className="w-4 h-4" />
                  <span>Start Roll Call</span>
                </button>
                <button
                  onClick={() => setActiveTab('academics')}
                  className="px-4 py-2 text-xs font-semibold text-slate-900 bg-white hover:bg-slate-100 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
                >
                  <GraduationCap className="w-4 h-4 text-indigo-600" />
                  <span>Open Gradebook</span>
                </button>
              </>
            )}
            {(currentRole === 'student' || currentRole === 'parent') && (
              <>
                <button
                  onClick={() => setSelectedStudentForReportCard(liamStudent)}
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
                >
                  <FileText className="w-4 h-4" />
                  <span>View Official Report Card</span>
                </button>
                <button
                  onClick={() => setActiveTab('finance')}
                  className="px-4 py-2 text-xs font-semibold text-slate-900 bg-white hover:bg-slate-100 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
                >
                  <CreditCard className="w-4 h-4 text-indigo-600" />
                  <span>View Tuition Receipts</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Enrollment */}
        <div className="p-5 bg-white border border-slate-200/80 rounded-xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Total Enrolled</span>
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">
              {stats.totalStudents}
            </span>
            <span className="text-xs text-slate-500">active pupils</span>
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
            <span>Grade 9-12</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-600 font-medium">+3 this month</span>
          </div>
        </div>

        {/* Metric 2: Today's Attendance */}
        <div className="p-5 bg-white border border-slate-200/80 rounded-xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Today's Attendance</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">
              {stats.attendanceTodayPercent}%
            </span>
            <span className="text-xs text-emerald-600 font-medium">On-Target</span>
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
            <span>Roll Call active</span>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setActiveTab('attendance')}
              className="text-indigo-600 hover:underline font-medium"
            >
              Verify roll call →
            </button>
          </div>
        </div>

        {/* Metric 3: Tuition Collection */}
        <div className="p-5 bg-white border border-slate-200/80 rounded-xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Term 1 Tuition</span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-xl md:text-2xl font-bold font-mono tabular-nums text-slate-900">
              {formatKES(stats.feesCollectedTotal)}
            </span>
            <span className="text-xs text-slate-500">collected</span>
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
            <span className="font-mono tabular-nums text-rose-600">
              {formatKES(stats.feesPendingTotal)} pending
            </span>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setActiveTab('finance')}
              className="text-indigo-600 hover:underline font-medium"
            >
              Ledger →
            </button>
          </div>
        </div>

        {/* Metric 4: Academic Performance */}
        <div className="p-5 bg-white border border-slate-200/80 rounded-xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Academic Standing</span>
            <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">
              3.78
            </span>
            <span className="text-xs text-slate-500">Academy GPA Avg</span>
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
            <span>5 Teaching Depts</span>
            <span aria-hidden="true">·</span>
            <span className="text-indigo-600 font-medium">Mid-Terms in 12d</span>
          </div>
        </div>
      </div>

      {/* Main Split Grid: Schedule & Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Class Schedule & Quick Actions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Schedule Card */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Today's Master Schedule
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Monday timetable · Grade 10-A stream
                </p>
              </div>
              <button
                onClick={() => setActiveTab('timetable')}
                className="text-xs text-indigo-600 font-semibold hover:text-indigo-700 flex items-center gap-1"
              >
                <span>Full Timetable</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100 mt-2">
              {todayClasses.map((item, idx) => (
                <div
                  key={item.id}
                  className="py-3 flex items-center justify-between gap-4 hover:bg-slate-50/70 px-2 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex flex-col items-center justify-center text-[10px] font-bold">
                      <span>P{item.period}</span>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">
                        {item.subject}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                        <span>{item.teacherName}</span>
                        <span aria-hidden="true">·</span>
                        <span className="text-slate-600 font-medium">{item.room}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-mono tabular-nums text-slate-600">
                      {item.timeRange}
                    </span>
                    {idx === 0 && (
                      <span className="block text-[10px] text-emerald-600 font-semibold mt-0.5">
                        Current Session
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Shortcuts Bar */}
          <div className="p-5 bg-slate-100/70 border border-slate-200/80 rounded-xl">
            <div className="text-xs font-bold text-slate-800 mb-3">
              Institutional Operations & Quick Workflows
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                onClick={() => setActiveTab('students')}
                className="p-3 bg-white rounded-lg border border-slate-200/80 text-left hover:border-indigo-400 hover:shadow-xs transition-all"
              >
                <Users className="w-4 h-4 text-indigo-600 mb-1.5" />
                <div className="text-xs font-bold text-slate-900">Student Profiles</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Search records</div>
              </button>

              <button
                onClick={() => setActiveTab('attendance')}
                className="p-3 bg-white rounded-lg border border-slate-200/80 text-left hover:border-indigo-400 hover:shadow-xs transition-all"
              >
                <CalendarCheck className="w-4 h-4 text-emerald-600 mb-1.5" />
                <div className="text-xs font-bold text-slate-900">Roll Call</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Mark attendance</div>
              </button>

              <button
                onClick={() => setActiveTab('academics')}
                className="p-3 bg-white rounded-lg border border-slate-200/80 text-left hover:border-indigo-400 hover:shadow-xs transition-all"
              >
                <BookOpen className="w-4 h-4 text-purple-600 mb-1.5" />
                <div className="text-xs font-bold text-slate-900">Gradebook</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Exam marks & GPA</div>
              </button>

              <button
                onClick={() => setActiveTab('finance')}
                className="p-3 bg-white rounded-lg border border-slate-200/80 text-left hover:border-indigo-400 hover:shadow-xs transition-all"
              >
                <CreditCard className="w-4 h-4 text-amber-600 mb-1.5" />
                <div className="text-xs font-bold text-slate-900">Fee Billing</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Receipts & ledger</div>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): Official Notices & Alerts */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">
                Official Announcements
              </h3>
              <button
                onClick={() => setActiveTab('notices')}
                className="text-xs text-indigo-600 font-semibold hover:text-indigo-700"
              >
                View all
              </button>
            </div>

            <div className="divide-y divide-slate-100 mt-2 space-y-2">
              {notices.slice(0, 3).map((notice) => (
                <div key={notice.id} className="pt-3 first:pt-1">
                  <div className="flex items-center gap-2 text-[11px] text-slate-500">
                    <span className="font-semibold text-indigo-700">{notice.category}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono tabular-nums">{notice.date}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 mt-1 leading-snug">
                    {notice.title}
                  </h4>
                  <p className="text-[11px] text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                    {notice.content}
                  </p>
                  <div className="mt-2 text-[10px] text-slate-400">
                    Issued by: {notice.author} ({notice.authorRole})
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 mt-3 border-t border-slate-100">
              <button
                onClick={() => setIsCreateNoticeModalOpen(true)}
                className="w-full py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors text-center"
              >
                + Broadcast Institutional Notice
              </button>
            </div>
          </div>

          {/* Academic Term Progress Card */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-2">
              Fall Term Key Milestones
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-slate-800">Term 1 Admissions Concluded</div>
                  <div className="text-[11px] text-slate-500">September 15, 2026</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-slate-800">Mid-Term Assessment Week</div>
                  <div className="text-[11px] text-slate-500">October 19 - 23, 2026</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-slate-800">Parent-Teacher Conference Day</div>
                  <div className="text-[11px] text-slate-500">October 30, 2026</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
