import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { GradeEntry } from '../../types/school';
import {
  Award,
  BookOpen,
  FileText,
  Plus,
  Search,
  Filter,
  CheckCircle,
} from 'lucide-react';

export const AcademicsView: React.FC = () => {
  const {
    students,
    grades,
    addGradeEntry,
    setSelectedStudentForReportCard,
    currentRole,
  } = useSchool();

  const [selectedTerm, setSelectedTerm] = useState<string>('Term 1 Final');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showAddGradeModal, setShowAddGradeModal] = useState<boolean>(false);

  // New Grade Form
  const [newStudentId, setNewStudentId] = useState<string>(students[0]?.id || '');
  const [newSubject, setNewSubject] = useState<string>('Advanced Algebra');
  const [newScore, setNewScore] = useState<number>(92);
  const [newRemarks, setNewRemarks] = useState<string>('Demonstrates solid analytical mastery and consistent homework submission.');

  const subjectsList = [
    'all',
    'Advanced Algebra',
    'Chemistry & Lab',
    'World Literature & Rhetoric',
    'World History',
    'Spanish Literature',
    'Physics Foundations',
  ];

  const filteredGrades = grades.filter((g) => {
    const matchTerm = g.term === selectedTerm;
    const matchSubject = selectedSubject === 'all' || g.subject === selectedSubject;
    const matchSearch =
      !searchTerm ||
      g.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.subject.toLowerCase().includes(searchTerm.toLowerCase());
    return matchTerm && matchSubject && matchSearch;
  });

  const calculateLetter = (score: number) => {
    if (score >= 97) return 'A+';
    if (score >= 93) return 'A';
    if (score >= 90) return 'A-';
    if (score >= 87) return 'B+';
    if (score >= 83) return 'B';
    if (score >= 80) return 'B-';
    if (score >= 70) return 'C';
    return 'F';
  };

  const handleSaveGrade = (e: React.FormEvent) => {
    e.preventDefault();
    const student = students.find((s) => s.id === newStudentId);
    if (!student) return;

    addGradeEntry({
      studentId: student.id,
      studentName: student.fullName,
      grade: student.grade,
      subject: newSubject,
      term: selectedTerm as any,
      score: Number(newScore),
      maxScore: 100,
      letterGrade: calculateLetter(Number(newScore)),
      remarks: newRemarks,
    });

    setShowAddGradeModal(false);
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Academics & Gradebook
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage subject-level assessments, calculate weighted term GPAs, and issue certified student report cards.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              // Open report card for current first student or Liam Chen
              const target = students.find((s) => s.id === 'std-1004') || students[0];
              setSelectedStudentForReportCard(target);
            }}
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5 text-indigo-600" />
            <span>Generate Official Report Card</span>
          </button>

          {(currentRole === 'admin' || currentRole === 'teacher') && (
            <button
              onClick={() => setShowAddGradeModal(true)}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Record Assessment Score</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Term Selector */}
      <div className="p-4 bg-white border border-slate-200/80 rounded-xl shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Term Selector */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg overflow-x-auto">
            {['Mid-Term 1', 'Term 1 Final', 'Mid-Term 2', 'Annual Final'].map((term) => (
              <button
                key={term}
                onClick={() => setSelectedTerm(term)}
                className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                  selectedTerm === term
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {term}
              </button>
            ))}
          </div>

          {/* Subject Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Subject:</span>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              {subjectsList.map((s) => (
                <option key={s} value={s}>
                  {s === 'all' ? 'All Subjects' : s}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by student name or subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
      </div>

      {/* Gradebook Entries Table */}
      <div className="bg-white border border-slate-200/80 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Subject</th>
                <th className="py-3 px-4">Evaluation Term</th>
                <th className="py-3 px-4 text-right">Score</th>
                <th className="py-3 px-4 text-center">Letter Grade</th>
                <th className="py-3 px-4">Instructor Remarks</th>
                <th className="py-3 px-4 text-right">Report Card</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {filteredGrades.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No grade records found for this term & subject combination.
                  </td>
                </tr>
              ) : (
                filteredGrades.map((grade) => {
                  const studentObj = students.find((s) => s.id === grade.studentId);
                  return (
                    <tr key={grade.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900">{grade.studentName}</div>
                        <div className="text-[11px] text-slate-400">{grade.grade}</div>
                      </td>

                      <td className="py-3 px-4 font-medium text-slate-800">
                        {grade.subject}
                      </td>

                      <td className="py-3 px-4 text-slate-500">
                        {grade.term}
                      </td>

                      <td className="py-3 px-4 text-right font-mono tabular-nums font-semibold text-slate-900">
                        {grade.score} / {grade.maxScore}
                      </td>

                      <td className="py-3 px-4 text-center font-mono font-bold">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-xs ${
                            grade.letterGrade.startsWith('A')
                              ? 'bg-emerald-50 text-emerald-700'
                              : grade.letterGrade.startsWith('B')
                              ? 'bg-blue-50 text-blue-700'
                              : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          {grade.letterGrade}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-slate-600 max-w-xs truncate">
                        {grade.remarks}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => {
                            if (studentObj) setSelectedStudentForReportCard(studentObj);
                          }}
                          className="px-2.5 py-1 text-[11px] font-semibold text-indigo-700 hover:text-indigo-800 hover:bg-indigo-50 rounded-md transition-colors"
                        >
                          Print Transcript
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Grade Entry Modal */}
      {showAddGradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-base font-bold text-slate-900">
              Record Assessment Marks
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Add score for {selectedTerm}. Letter grade and cumulative GPA will adjust automatically.
            </p>

            <form onSubmit={handleSaveGrade} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Student
                </label>
                <select
                  value={newStudentId}
                  onChange={(e) => setNewStudentId(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.fullName} ({s.grade} - #{s.rollNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Subject
                </label>
                <select
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                >
                  <option value="Advanced Algebra">Advanced Algebra</option>
                  <option value="Chemistry & Lab">Chemistry & Lab</option>
                  <option value="World Literature & Rhetoric">World Literature & Rhetoric</option>
                  <option value="World History">World History</option>
                  <option value="Spanish Literature">Spanish Literature</option>
                  <option value="Physics Foundations">Physics Foundations</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Score Percentage (out of 100)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={newScore}
                  onChange={(e) => setNewScore(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Instructor Pedagogical Remarks
                </label>
                <textarea
                  rows={3}
                  value={newRemarks}
                  onChange={(e) => setNewRemarks(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddGradeModal(false)}
                  className="px-3.5 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
                >
                  Save Score
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
