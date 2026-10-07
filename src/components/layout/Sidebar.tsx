import React from 'react';
import { useSchool } from '../../context/SchoolContext';
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  Award,
  Calendar,
  CreditCard,
  FileText,
  Megaphone,
  School,
  ShieldCheck,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { activeTab, setActiveTab, currentRole, stats } = useSchool();

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: undefined,
    },
    {
      id: 'students',
      label: 'Students Directory',
      icon: Users,
      badge: `${stats.totalStudents}`,
    },
    {
      id: 'attendance',
      label: 'Attendance Register',
      icon: CalendarCheck,
      badge: `${stats.attendanceTodayPercent}%`,
    },
    {
      id: 'academics',
      label: 'Academics & Grades',
      icon: Award,
      badge: undefined,
    },
    {
      id: 'timetable',
      label: 'Class Timetable',
      icon: Calendar,
      badge: undefined,
    },
    {
      id: 'finance',
      label: 'Fee & Billing',
      icon: CreditCard,
      badge: stats.feesPendingTotal > 0 ? 'Pending' : undefined,
    },
    {
      id: 'assignments',
      label: 'Coursework & Tasks',
      icon: FileText,
      badge: undefined,
    },
    {
      id: 'notices',
      label: 'Notice Board',
      icon: Megaphone,
      badge: 'New',
    },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs md:hidden"
        />
      )}

      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 flex flex-col transition-transform duration-200 ease-in-out md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand header in sidebar */}
        <div className="flex items-center gap-3 px-6 h-16 border-b border-slate-800">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <School className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-white tracking-wider">
              JOOUST
            </div>
            <div className="text-[10px] text-slate-400 truncate max-w-[150px]">
              Jaramogi Oginga Odinga Univ.
            </div>
          </div>
        </div>

        {/* Navigation items */}
        <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
            Main Management
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                      isActive
                        ? 'bg-indigo-700 text-indigo-100'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Active Role indicator footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-2.5 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <div className="truncate">
              <span className="text-slate-200 font-semibold capitalize">{currentRole}</span> Mode
              <span className="text-[11px] text-slate-500 block truncate">
                Full portal access granted
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
