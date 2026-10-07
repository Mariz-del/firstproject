import React, { useState, useMemo } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { Student, FeeStatus } from '../../types/school';
import {
  Search,
  Plus,
  Download,
  Eye,
  FileText,
  Trash2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  X,
  CreditCard,
  UserCheck,
} from 'lucide-react';

export const StudentsView: React.FC = () => {
  const {
    students,
    deleteStudent,
    setIsEnrollModalOpen,
    setSelectedStudentForReportCard,
    globalSearch,
    setGlobalSearch,
    setSelectedInvoiceForReceipt,
    invoices,
  } = useSchool();

  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [selectedFeeStatus, setSelectedFeeStatus] = useState<string>('all');
  const [inspectedStudent, setInspectedStudent] = useState<Student | null>(null);

  // Filter students based on search, grade, and fee status
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchSearch =
        !globalSearch ||
        s.fullName.toLowerCase().includes(globalSearch.toLowerCase()) ||
        s.rollNumber.includes(globalSearch) ||
        s.parentName.toLowerCase().includes(globalSearch.toLowerCase());

      const matchGrade = selectedGrade === 'all' || s.grade === selectedGrade;
      const matchFee = selectedFeeStatus === 'all' || s.feesStatus === selectedFeeStatus;

      return matchSearch && matchGrade && matchFee;
    });
  }, [students, globalSearch, selectedGrade, selectedFeeStatus]);

  // Export to CSV
  const handleExportCSV = () => {
    const headers = [
      'Roll Number',
      'Full Name',
      'Grade',
      'Section',
      'Gender',
      'Date of Birth',
      'Parent Name',
      'Parent Phone',
      'Parent Email',
      'GPA',
      'Attendance Rate',
      'Fee Status',
    ];

    const rows = filteredStudents.map((s) => [
      s.rollNumber,
      `"${s.fullName}"`,
      `"${s.grade}"`,
      s.section,
      s.gender,
      s.dob,
      `"${s.parentName}"`,
      `"${s.parentPhone}"`,
      `"${s.parentEmail}"`,
      s.gpa,
      `${s.attendanceRate}%`,
      s.feesStatus,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `JOOUST_Students_Roster_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openStudentFeeReceipt = (student: Student) => {
    const inv = invoices.find((i) => i.studentId === student.id);
    if (inv) {
      setSelectedInvoiceForReceipt(inv);
    }
  };

  return (
    <div className="space-y-6">
      {/* View Header with Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Student Information System
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage academic enrollments, attendance standing, fee statuses, and parent contact directories.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => setIsEnrollModalOpen(true)}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Enroll New Student</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white border border-slate-200/80 rounded-xl shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Grade Segmented Control */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg overflow-x-auto">
            {['all', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'].map((g) => (
              <button
                key={g}
                onClick={() => setSelectedGrade(g)}
                className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                  selectedGrade === g
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {g === 'all' ? 'All Grades' : g}
              </button>
            ))}
          </div>

          {/* Fee Status Segmented Control */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg overflow-x-auto">
            {[
              { id: 'all', label: 'All Fees' },
              { id: 'paid', label: 'Paid' },
              { id: 'partial', label: 'Partial' },
              { id: 'overdue', label: 'Overdue' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setSelectedFeeStatus(f.id)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                  selectedFeeStatus === f.id
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Search input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            placeholder="Search roster by student name, roll number, or parent contact..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
          />
        </div>
      </div>

      {/* High-Density Students Data Table */}
      <div className="bg-white border border-slate-200/80 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                <th className="py-3 px-4">Roll #</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Class & Sec</th>
                <th className="py-3 px-4">Parent / Guardian</th>
                <th className="py-3 px-4 text-right">Attendance</th>
                <th className="py-3 px-4 text-right">Term GPA</th>
                <th className="py-3 px-4 text-center">Fee Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <p className="text-sm font-medium">No students match current filters.</p>
                    <button
                      onClick={() => {
                        setSelectedGrade('all');
                        setSelectedFeeStatus('all');
                        setGlobalSearch('');
                      }}
                      className="mt-2 text-xs text-indigo-600 hover:underline font-semibold"
                    >
                      Clear search & filters
                    </button>
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr
                    key={student.id}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                    onClick={() => setInspectedStudent(student)}
                  >
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
                          <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                            {student.fullName.charAt(0)}
                          </div>
                        )}
                        <div>
                          <div className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                            {student.fullName}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {student.gender} · Born {student.dob}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-medium text-slate-800">
                        {student.grade} - {student.section}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <div className="text-slate-800 font-medium">{student.parentName}</div>
                      <div className="text-[11px] text-slate-500">{student.parentPhone}</div>
                    </td>

                    <td className="py-3 px-4 text-right font-mono tabular-nums">
                      <span
                        className={`font-semibold ${
                          student.attendanceRate >= 95
                            ? 'text-emerald-700'
                            : student.attendanceRate >= 90
                            ? 'text-amber-700'
                            : 'text-rose-700'
                        }`}
                      >
                        {student.attendanceRate}%
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right font-mono tabular-nums font-semibold text-slate-900">
                      {student.gpa.toFixed(2)}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-block text-[11px] font-semibold capitalize ${
                          student.feesStatus === 'paid'
                            ? 'text-emerald-700'
                            : student.feesStatus === 'partial'
                            ? 'text-amber-700'
                            : 'text-rose-700'
                        }`}
                      >
                        {student.feesStatus}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setInspectedStudent(student)}
                          className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-md transition-colors"
                          title="View Profile Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setSelectedStudentForReportCard(student)}
                          className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-md transition-colors"
                          title="Generate Official Report Card"
                        >
                          <FileText className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Remove ${student.fullName} from enrollment records?`)) {
                              deleteStudent(student.id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                          title="Delete Record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500">
          <div>
            Showing <span className="font-semibold text-slate-900">{filteredStudents.length}</span> of{' '}
            <span className="font-semibold text-slate-900">{students.length}</span> enrolled students
          </div>
          <div className="text-[11px] text-slate-400">
            Click any row to open full student dossier
          </div>
        </div>
      </div>

      {/* Student Profile Detail Drawer / Modal */}
      {inspectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Drawer Header */}
            <div className="p-6 border-b border-slate-100 flex items-start justify-between">
              <div className="flex items-center gap-4">
                {inspectedStudent.avatarUrl ? (
                  <img
                    src={inspectedStudent.avatarUrl}
                    alt={inspectedStudent.fullName}
                    className="w-14 h-14 rounded-full object-cover ring-2 ring-indigo-100"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xl">
                    {inspectedStudent.fullName.charAt(0)}
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {inspectedStudent.fullName}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                    <span>Roll #{inspectedStudent.rollNumber}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-medium text-slate-700">
                      {inspectedStudent.grade} - Section {inspectedStudent.section}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>Blood: {inspectedStudent.bloodGroup}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setInspectedStudent(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="p-6 space-y-6">
              {/* Stat highlight */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                  <div className="text-[11px] text-slate-500">Cumulative GPA</div>
                  <div className="text-lg font-bold font-mono tabular-nums text-slate-900 mt-0.5">
                    {inspectedStudent.gpa.toFixed(2)} / 4.0
                  </div>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                  <div className="text-[11px] text-slate-500">Attendance Rate</div>
                  <div className="text-lg font-bold font-mono tabular-nums text-emerald-700 mt-0.5">
                    {inspectedStudent.attendanceRate}%
                  </div>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                  <div className="text-[11px] text-slate-500">Tuition Status</div>
                  <div className="text-lg font-bold capitalize text-slate-900 mt-0.5">
                    {inspectedStudent.feesStatus}
                  </div>
                </div>
              </div>

              {/* Guardian & Contact Information */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Guardian & Emergency Contact
                </h4>
                <div className="space-y-2.5 text-xs text-slate-700 bg-slate-50/70 p-4 rounded-xl border border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Primary Guardian:</span>
                    <span className="font-semibold text-slate-900">
                      {inspectedStudent.parentName} ({inspectedStudent.parentRelationship})
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400" /> Phone:
                    </span>
                    <span className="font-mono text-slate-900">{inspectedStudent.parentPhone}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-slate-400" /> Email:
                    </span>
                    <span className="text-slate-900">{inspectedStudent.parentEmail}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" /> Home Address:
                    </span>
                    <span className="text-slate-900">{inspectedStudent.address}</span>
                  </div>
                </div>
              </div>

              {/* Institutional Details */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Enrollment History
                </h4>
                <div className="flex items-center justify-between text-xs p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div>
                    <span className="text-slate-500">First Matriculated: </span>
                    <span className="font-semibold text-slate-900">{inspectedStudent.enrollmentDate}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Academic Standing: </span>
                    <span className="font-semibold text-emerald-700 uppercase">Good Standing</span>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-end gap-3">
                <button
                  onClick={() => {
                    openStudentFeeReceipt(inspectedStudent);
                  }}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <CreditCard className="w-4 h-4 text-slate-500" />
                  <span>Fee Ledger & Receipt</span>
                </button>
                <button
                  onClick={() => {
                    setSelectedStudentForReportCard(inspectedStudent);
                    setInspectedStudent(null);
                  }}
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <FileText className="w-4 h-4" />
                  <span>Generate Report Card</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
