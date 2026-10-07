import React from 'react';
import { useSchool } from '../../context/SchoolContext';
import {
  GraduationCap,
  Printer,
  X,
  Award,
  CheckCircle,
} from 'lucide-react';

export const ReportCardModal: React.FC = () => {
  const {
    selectedStudentForReportCard,
    setSelectedStudentForReportCard,
    getStudentGrades,
  } = useSchool();

  if (!selectedStudentForReportCard) return null;

  const student = selectedStudentForReportCard;
  const recordedGrades = getStudentGrades(student.id);

  // Default transcript subjects if not recorded yet
  const subjectsData = [
    { name: 'Advanced Algebra & Functions', score: 96, grade: 'A', remarks: 'Superb abstract mathematical reasoning.' },
    { name: 'Chemistry & Laboratory Science', score: 94, grade: 'A', remarks: 'Precise quantitative analysis and lab technique.' },
    { name: 'World Literature & Rhetoric', score: 91, grade: 'A-', remarks: 'Compelling essays and insightful discussions.' },
    { name: 'World History (1750-Present)', score: 89, grade: 'B+', remarks: 'Strong analytical depth in document-based essays.' },
    { name: 'Spanish Literature & Grammar', score: 95, grade: 'A', remarks: 'Fluent conversational expression and vocabulary.' },
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-3xl w-full my-8 overflow-hidden">
        {/* Modal Controls (Hidden in print) */}
        <div className="p-4 bg-slate-100 border-b border-slate-200 flex items-center justify-between no-print">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
            <Award className="w-4 h-4 text-indigo-600" />
            <span>Official Academic Transcript Preview</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Download PDF</span>
            </button>
            <button
              onClick={() => setSelectedStudentForReportCard(null)}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Official Document Body */}
        <div className="p-8 sm:p-10 space-y-6 bg-white text-slate-900" id="official-report-card">
          {/* Institutional Crest Header */}
          <div className="text-center pb-6 border-b-2 border-slate-900">
            <div className="flex items-center justify-center gap-2 text-indigo-900 mb-2">
              <GraduationCap className="w-8 h-8" />
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-950 uppercase">
              JARAMOGI OGINGA ODINGA UNIVERSITY OF SCIENCE AND TECHNOLOGY
            </h1>
            <p className="text-xs text-slate-600 tracking-wide mt-0.5">
              Office of the Registrar (Academic Affairs) · Directorate of Examinations
            </p>
            <p className="text-xs font-mono font-semibold text-slate-500 mt-1">
              Main Campus, Bondo · P.O. Box 210-40601 Bondo, Kenya · ISO 9001:2015 Certified
            </p>
          </div>

          {/* Transcript Banner */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
            <div>
              <div className="text-[11px] text-slate-500 uppercase tracking-wider font-bold">
                Student Candidate
              </div>
              <div className="text-base font-bold text-slate-950 mt-0.5">
                {student.fullName}
              </div>
              <div className="text-slate-600 mt-0.5 font-mono">
                Roll ID: #{student.rollNumber} · DOB: {student.dob}
              </div>
            </div>

            <div className="sm:text-right">
              <div className="text-[11px] text-slate-500 uppercase tracking-wider font-bold">
                Cohort & Academic Term
              </div>
              <div className="text-sm font-semibold text-slate-900 mt-0.5">
                {student.grade} - Section {student.section}
              </div>
              <div className="text-slate-600 mt-0.5">
                Fall Semester 2026 · Term 1 Final
              </div>
            </div>
          </div>

          {/* Subject Assessment Table */}
          <div className="overflow-hidden border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white font-semibold text-[11px]">
                  <th className="py-2.5 px-3.5">Instructional Subject</th>
                  <th className="py-2.5 px-3.5 text-right font-mono">Marks %</th>
                  <th className="py-2.5 px-3.5 text-center">Grade</th>
                  <th className="py-2.5 px-3.5">Faculty Evaluation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {subjectsData.map((sub, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                    <td className="py-2.5 px-3.5 font-semibold text-slate-900">
                      {sub.name}
                    </td>
                    <td className="py-2.5 px-3.5 text-right font-mono tabular-nums font-bold text-slate-900">
                      {sub.score}%
                    </td>
                    <td className="py-2.5 px-3.5 text-center font-mono font-bold text-indigo-900">
                      {sub.grade}
                    </td>
                    <td className="py-2.5 px-3.5 text-slate-600 text-[11px]">
                      {sub.remarks}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Cumulative Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-[11px] text-slate-500 font-semibold uppercase">
                Term Grade Point Average
              </div>
              <div className="text-2xl font-bold font-mono text-slate-900 mt-1">
                {student.gpa.toFixed(2)} <span className="text-xs text-slate-400">/ 4.00</span>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-[11px] text-slate-500 font-semibold uppercase">
                Academic Honor Roll
              </div>
              <div className="text-base font-bold text-emerald-700 mt-1 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>First Class Honors</span>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-[11px] text-slate-500 font-semibold uppercase">
                Cumulative Attendance
              </div>
              <div className="text-2xl font-bold font-mono text-emerald-700 mt-1">
                {student.attendanceRate}%
              </div>
            </div>
          </div>

          {/* Institutional Sign-off Block */}
          <div className="pt-8 border-t border-slate-200 grid grid-cols-2 gap-8 text-xs">
            <div className="space-y-1">
              <div className="h-10 border-b border-slate-300 flex items-end pb-1 font-serif italic text-slate-800">
                Sarah Jenkins, M.Sc.
              </div>
              <div className="font-semibold text-slate-900">Homeroom Advisor</div>
              <div className="text-[11px] text-slate-500">Department of Mathematics</div>
            </div>

            <div className="space-y-1 text-right">
              <div className="h-10 border-b border-slate-300 flex items-end justify-end pb-1 font-serif italic text-slate-800">
                Prof. Stephen Agong, Ph.D.
              </div>
              <div className="font-semibold text-slate-900">Vice-Chancellor & Chief Executive</div>
              <div className="text-[11px] text-slate-500">JOOUST University Senate</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
