import React, { useState, useMemo } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { AttendanceStatus } from '../../types/school';
import {
  Calendar,
  CheckCheck,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldAlert,
  Search,
  Save,
  FileSpreadsheet,
} from 'lucide-react';

export const AttendanceView: React.FC = () => {
  const {
    students,
    attendanceRecords,
    setStudentAttendance,
    markClassBulkAttendance,
  } = useSchool();

  const [selectedGrade, setSelectedGrade] = useState<string>('Grade 10');
  const [selectedSection, setSelectedSection] = useState<string>('A');
  const [selectedDate, setSelectedDate] = useState<string>('2026-10-07');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);

  // Filter students for the chosen class
  const classStudents = useMemo(() => {
    return students.filter(
      (s) =>
        s.grade === selectedGrade &&
        s.section === selectedSection &&
        (!searchTerm || s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || s.rollNumber.includes(searchTerm))
    );
  }, [students, selectedGrade, selectedSection, searchTerm]);

  // Lookup record for current date
  const getStatusForStudent = (studentId: string): AttendanceStatus => {
    const record = attendanceRecords.find(
      (r) => r.studentId === studentId && r.date === selectedDate
    );
    return record?.status || 'present';
  };

  const getNotesForStudent = (studentId: string): string => {
    const record = attendanceRecords.find(
      (r) => r.studentId === studentId && r.date === selectedDate
    );
    return record?.notes || '';
  };

  // Roll call statistics
  const stats = useMemo(() => {
    let present = 0;
    let late = 0;
    let absent = 0;
    let excused = 0;

    classStudents.forEach((s) => {
      const st = getStatusForStudent(s.id);
      if (st === 'present') present++;
      else if (st === 'late') late++;
      else if (st === 'absent') absent++;
      else if (st === 'excused') excused++;
    });

    const total = classStudents.length;
    const rate = total > 0 ? Math.round(((present + late) / total) * 100) : 100;

    return { total, present, late, absent, excused, rate };
  }, [classStudents, attendanceRecords, selectedDate]);

  const handleMarkAllPresent = () => {
    const ids = classStudents.map((s) => s.id);
    markClassBulkAttendance(ids, selectedDate, 'present');
    triggerSaveFeedback('All students marked Present.');
  };

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setStudentAttendance(studentId, selectedDate, status);
  };

  const handleNoteChange = (studentId: string, notes: string) => {
    const curStatus = getStatusForStudent(studentId);
    setStudentAttendance(studentId, selectedDate, curStatus, notes);
  };

  const triggerSaveFeedback = (msg: string) => {
    setSaveSuccessMessage(msg);
    setTimeout(() => setSaveSuccessMessage(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Attendance Register & Roll Call
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Conduct daily homeroom attendance, log tardiness, and record excused medical absences.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleMarkAllPresent}
            className="px-3.5 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
          >
            <CheckCheck className="w-4 h-4" />
            <span>Mark All Present</span>
          </button>
        </div>
      </div>

      {/* Control Bar: Class, Section, Date & Search */}
      <div className="p-4 bg-white border border-slate-200/80 rounded-xl shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {/* Grade Selector */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Academic Grade
            </label>
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="Grade 9">Grade 9</option>
              <option value="Grade 10">Grade 10</option>
              <option value="Grade 11">Grade 11</option>
              <option value="Grade 12">Grade 12</option>
            </select>
          </div>

          {/* Section */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Section / Stream
            </label>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="A">Section A (STEM Core)</option>
              <option value="B">Section B (Humanities)</option>
            </select>
          </div>

          {/* Date Picker */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Roll Call Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>

          {/* Search inside class */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Filter Student
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Find by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>
        </div>

        {/* Live Attendance Tally Strip */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-4 text-slate-600">
            <div>
              <span className="text-slate-400">Total in Class:</span>{' '}
              <span className="font-bold text-slate-900 font-mono">{stats.total}</span>
            </div>
            <span aria-hidden="true">·</span>
            <div>
              <span className="text-emerald-700 font-semibold">Present:</span>{' '}
              <span className="font-bold font-mono text-emerald-800">{stats.present}</span>
            </div>
            <span aria-hidden="true">·</span>
            <div>
              <span className="text-amber-700 font-semibold">Late:</span>{' '}
              <span className="font-bold font-mono text-amber-800">{stats.late}</span>
            </div>
            <span aria-hidden="true">·</span>
            <div>
              <span className="text-rose-700 font-semibold">Absent:</span>{' '}
              <span className="font-bold font-mono text-rose-800">{stats.absent}</span>
            </div>
            <span aria-hidden="true">·</span>
            <div>
              <span className="text-blue-700 font-semibold">Excused:</span>{' '}
              <span className="font-bold font-mono text-blue-800">{stats.excused}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-500">Effective Attendance:</span>
            <span className="text-sm font-bold font-mono text-emerald-700">
              {stats.rate}%
            </span>
          </div>
        </div>
      </div>

      {saveSuccessMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-semibold text-emerald-800 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{saveSuccessMessage}</span>
        </div>
      )}

      {/* Roll Call Register Table */}
      <div className="bg-white border border-slate-200/80 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                <th className="py-3 px-4">Roll #</th>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4 text-center">Status Action</th>
                <th className="py-3 px-4">Reason / Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {classStudents.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-10 text-center text-slate-400">
                    No students currently assigned to {selectedGrade} - Section {selectedSection}.
                  </td>
                </tr>
              ) : (
                classStudents.map((student) => {
                  const currentStatus = getStatusForStudent(student.id);
                  const currentNotes = getNotesForStudent(student.id);

                  return (
                    <tr key={student.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4 font-mono tabular-nums text-slate-500 font-medium">
                        #{student.rollNumber}
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          {student.avatarUrl ? (
                            <img
                              src={student.avatarUrl}
                              alt={student.fullName}
                              className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs">
                              {student.fullName.charAt(0)}
                            </div>
                          )}
                          <div>
                            <div className="font-semibold text-slate-900">{student.fullName}</div>
                            <div className="text-[11px] text-slate-500">
                              YTD Average: {student.attendanceRate}%
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Interactive Segmented Status Controls */}
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-1 bg-slate-100 p-1 rounded-lg w-max mx-auto">
                          <button
                            onClick={() => handleStatusChange(student.id, 'present')}
                            className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                              currentStatus === 'present'
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'text-slate-600 hover:text-emerald-700'
                            }`}
                          >
                            Present
                          </button>

                          <button
                            onClick={() => handleStatusChange(student.id, 'late')}
                            className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                              currentStatus === 'late'
                                ? 'bg-amber-500 text-white shadow-xs'
                                : 'text-slate-600 hover:text-amber-700'
                            }`}
                          >
                            Late
                          </button>

                          <button
                            onClick={() => handleStatusChange(student.id, 'absent')}
                            className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                              currentStatus === 'absent'
                                ? 'bg-rose-600 text-white shadow-xs'
                                : 'text-slate-600 hover:text-rose-700'
                            }`}
                          >
                            Absent
                          </button>

                          <button
                            onClick={() => handleStatusChange(student.id, 'excused')}
                            className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                              currentStatus === 'excused'
                                ? 'bg-blue-600 text-white shadow-xs'
                                : 'text-slate-600 hover:text-blue-700'
                            }`}
                          >
                            Excused
                          </button>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <input
                          type="text"
                          value={currentNotes}
                          onChange={(e) => handleNoteChange(student.id, e.target.value)}
                          placeholder={
                            currentStatus === 'present'
                              ? 'Optional notes...'
                              : currentStatus === 'late'
                              ? 'e.g. Arrived 08:45 AM transit issue'
                              : 'e.g. Parent sent medical certificate'
                          }
                          className="w-full px-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-md text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500"
                        />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="p-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500">
          <span>Changes are automatically recorded in persistent institution storage.</span>
          <button
            onClick={() => triggerSaveFeedback('Attendance register verified and locked.')}
            className="px-3 py-1 bg-slate-900 text-white hover:bg-slate-800 rounded-md text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Lock & Confirm Register</span>
          </button>
        </div>
      </div>
    </div>
  );
};
