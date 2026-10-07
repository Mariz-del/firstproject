import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { Assignment } from '../../types/school';
import {
  FileText,
  Calendar,
  CheckCircle,
  Upload,
  Plus,
  User,
  Clock,
  Sparkles,
} from 'lucide-react';

export const AssignmentsView: React.FC = () => {
  const {
    assignments,
    addAssignment,
    submitAssignmentMock,
    currentRole,
  } = useSchool();

  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [submittedIds, setSubmittedIds] = useState<string[]>(['asg-01']);
  const [submissionFeedback, setSubmissionFeedback] = useState<string | null>(null);

  // New assignment form state
  const [newTitle, setNewTitle] = useState<string>('');
  const [newSubject, setNewSubject] = useState<string>('Mathematics');
  const [newDueDate, setNewDueDate] = useState<string>('2026-10-20');
  const [newDesc, setNewDesc] = useState<string>('');
  const [newMaxMarks, setNewMaxMarks] = useState<number>(50);

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addAssignment({
      title: newTitle,
      subject: newSubject,
      grade: 'Grade 10',
      section: 'A',
      teacherName: 'Sarah Jenkins',
      dueDate: newDueDate,
      description: newDesc,
      maxMarks: Number(newMaxMarks),
      totalStudents: 26,
    });

    setShowAddModal(false);
    setNewTitle('');
    setNewDesc('');
  };

  const handleStudentSubmit = (asgId: string) => {
    submitAssignmentMock(asgId);
    setSubmittedIds((prev) => [...prev, asgId]);
    setSubmissionFeedback('Assignment submission uploaded and recorded successfully.');
    setTimeout(() => setSubmissionFeedback(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Coursework & Homework Assignments
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Track coursework deadlines, problem set handouts, and manage student submissions.
          </p>
        </div>

        {(currentRole === 'admin' || currentRole === 'teacher') && (
          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Assignment</span>
          </button>
        )}
      </div>

      {submissionFeedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-semibold text-emerald-800 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{submissionFeedback}</span>
        </div>
      )}

      {/* Assignments List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {assignments.map((asg) => {
          const isSubmitted = submittedIds.includes(asg.id);
          const percent = Math.round((asg.submissionsCount / asg.totalStudents) * 100);

          return (
            <div
              key={asg.id}
              className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="text-xs font-semibold text-indigo-700">
                    {asg.subject}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-slate-500 font-mono">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Due {asg.dueDate}</span>
                  </div>
                </div>

                <div className="mt-3">
                  <h3 className="text-sm font-bold text-slate-900 leading-snug">
                    {asg.title}
                  </h3>
                  <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                    {asg.description}
                  </p>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                  <span>Class Submissions:</span>
                  <span className="font-mono tabular-nums font-semibold text-slate-900">
                    {asg.submissionsCount} / {asg.totalStudents} ({percent}%)
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 rounded-full"
                    style={{ width: `${percent}%` }}
                  />
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="text-[11px] text-slate-400">
                    Max Marks: <span className="font-mono font-bold text-slate-700">{asg.maxMarks}</span>
                  </div>

                  {(currentRole === 'student' || currentRole === 'parent') ? (
                    isSubmitted ? (
                      <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Submitted</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => handleStudentSubmit(asg.id)}
                        className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs flex items-center gap-1.5"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Solution</span>
                      </button>
                    )
                  ) : (
                    <span className="text-xs text-slate-500">
                      Instructor: {asg.teacherName}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Assignment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-base font-bold text-slate-900">
              Create New Coursework Assignment
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Issue homework problem sets or lab writeups for students.
            </p>

            <form onSubmit={handleCreateAssignment} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Assignment Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Kinematics Problem Set 3"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Subject
                  </label>
                  <select
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  >
                    <option value="Mathematics">Mathematics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="World History">World History</option>
                    <option value="Spanish">Spanish</option>
                    <option value="Computer Science">Computer Science</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Max Marks / Grading Scale
                </label>
                <input
                  type="number"
                  min="10"
                  max="100"
                  value={newMaxMarks}
                  onChange={(e) => setNewMaxMarks(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Instructions & Resource Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Detail instructions, chapters to reference, formatting..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  required
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3.5 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
                >
                  Publish Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
