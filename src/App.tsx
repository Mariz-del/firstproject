/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SchoolProvider, useSchool } from './context/SchoolContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { DashboardView } from './components/dashboard/DashboardView';
import { StudentsView } from './components/students/StudentsView';
import { AttendanceView } from './components/attendance/AttendanceView';
import { AcademicsView } from './components/academics/AcademicsView';
import { TimetableView } from './components/timetable/TimetableView';
import { FinanceView } from './components/finance/FinanceView';
import { AssignmentsView } from './components/assignments/AssignmentsView';
import { NoticesView } from './components/notices/NoticesView';
import { EnrollStudentModal } from './components/modals/EnrollStudentModal';
import { ReportCardModal } from './components/modals/ReportCardModal';
import { ReceiptModal } from './components/modals/ReceiptModal';
import { Menu } from 'lucide-react';

const SchoolPortalContent: React.FC = () => {
  const { activeTab } = useSchool();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden">
      {/* Sidebar Navigation */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Header with Mobile Hamburger Button */}
        <div className="relative flex items-center">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="md:hidden p-3.5 text-slate-600 hover:text-slate-900 z-40"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1 min-w-0">
            <Header />
          </div>
        </div>

        {/* Content Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'dashboard' && <DashboardView />}
            {activeTab === 'students' && <StudentsView />}
            {activeTab === 'attendance' && <AttendanceView />}
            {activeTab === 'academics' && <AcademicsView />}
            {activeTab === 'timetable' && <TimetableView />}
            {activeTab === 'finance' && <FinanceView />}
            {activeTab === 'assignments' && <AssignmentsView />}
            {activeTab === 'notices' && <NoticesView />}
          </div>
        </main>
      </div>

      {/* Global Modals */}
      <EnrollStudentModal />
      <ReportCardModal />
      <ReceiptModal />
    </div>
  );
};

export default function App() {
  return (
    <SchoolProvider>
      <SchoolPortalContent />
    </SchoolProvider>
  );
}
