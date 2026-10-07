import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { Student } from '../../types/school';
import { X, UserPlus, GraduationCap, CheckCircle } from 'lucide-react';

export const EnrollStudentModal: React.FC = () => {
  const { isEnrollModalOpen, setIsEnrollModalOpen, addStudent } = useSchool();

  const [fullName, setFullName] = useState('');
  const [rollNumber, setRollNumber] = useState(`10${Math.floor(Math.random() * 80) + 10}`);
  const [grade, setGrade] = useState('Grade 10');
  const [section, setSection] = useState('A');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Female');
  const [dob, setDob] = useState('2010-06-15');
  const [parentName, setParentName] = useState('');
  const [parentRelationship, setParentRelationship] = useState('Mother');
  const [parentPhone, setParentPhone] = useState('+1 (555) 720-');
  const [parentEmail, setParentEmail] = useState('');
  const [address, setAddress] = useState('140 Academic Way, Apt 3B');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [feesStatus, setFeesStatus] = useState<'paid' | 'partial' | 'overdue'>('paid');

  if (!isEnrollModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !parentName.trim()) return;

    addStudent({
      rollNumber,
      fullName,
      grade,
      section,
      gender,
      dob,
      parentName,
      parentRelationship,
      parentPhone,
      parentEmail: parentEmail || `${fullName.toLowerCase().replace(/\s+/g, '.')}@family.meridian.edu`,
      address,
      bloodGroup,
      enrollmentDate: '2026-10-07',
      status: 'active',
      feesStatus,
    });

    setIsEnrollModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Enroll New Student
              </h3>
              <p className="text-xs text-slate-500">
                Register admissions profile, cohort assignment, and guardian records.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsEnrollModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="text-xs font-bold text-slate-900 uppercase tracking-wider pb-1 border-b border-slate-100">
            Student Demographics
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Charlotte Miller"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Roll / ID Number *
              </label>
              <input
                type="text"
                required
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Academic Grade
              </label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
              >
                <option value="Grade 9">Grade 9</option>
                <option value="Grade 10">Grade 10</option>
                <option value="Grade 11">Grade 11</option>
                <option value="Grade 12">Grade 12</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Class Section
              </label>
              <select
                value={section}
                onChange={(e) => setSection(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
              >
                <option value="A">Section A (STEM Core)</option>
                <option value="B">Section B (Humanities)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Date of Birth
              </label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Blood Group
              </label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono"
              >
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>
          </div>

          <div className="text-xs font-bold text-slate-900 uppercase tracking-wider pt-3 pb-1 border-b border-slate-100">
            Parent & Guardian Emergency Contact
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Guardian Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Thomas Miller"
                value={parentName}
                onChange={(e) => setParentName(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Relationship
              </label>
              <select
                value={parentRelationship}
                onChange={(e) => setParentRelationship(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
              >
                <option value="Mother">Mother</option>
                <option value="Father">Father</option>
                <option value="Legal Guardian">Legal Guardian</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Contact Phone *
              </label>
              <input
                type="text"
                required
                value={parentPhone}
                onChange={(e) => setParentPhone(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Guardian Email
              </label>
              <input
                type="email"
                placeholder="t.miller@domain.com"
                value={parentEmail}
                onChange={(e) => setParentEmail(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Residential Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setIsEnrollModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
            >
              Confirm Admission
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
