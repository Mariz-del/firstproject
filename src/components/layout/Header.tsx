import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { UserRole } from '../../types/school';
import {
  Bell,
  Search,
  Plus,
  RefreshCw,
  UserCheck,
  GraduationCap,
  Sparkles,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    currentUser,
    currentRole,
    setCurrentRole,
    allProfiles,
    globalSearch,
    setGlobalSearch,
    setIsEnrollModalOpen,
    setIsCreateNoticeModalOpen,
    resetToDefaultData,
    notices,
    activeTab,
  } = useSchool();

  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const getBreadcrumb = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Institutional Overview';
      case 'students':
        return 'Student Information System';
      case 'attendance':
        return 'Daily Attendance & Roll Call';
      case 'academics':
        return 'Academic Records & Gradebook';
      case 'timetable':
        return 'Class Timetable & Master Schedule';
      case 'finance':
        return 'Tuition & Fee Management';
      case 'assignments':
        return 'Coursework & Assignments';
      case 'notices':
        return 'Official Communications & Notices';
      default:
        return 'Dashboard';
    }
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-6 bg-white border-b border-slate-200/80 shadow-xs">
      {/* Zone 1: Brand & Term Context */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-indigo-900 text-white shadow-xs">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-bold tracking-tight text-slate-900 leading-tight max-w-sm sm:max-w-md truncate">
              JARAMOGI OGINGA ODINGA UNIVERSITY OF SCIENCE AND TECHNOLOGY
            </div>
            <div className="text-[11px] text-slate-500 font-medium">
              JOOUST Academic & Student Management Portal
            </div>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-2 text-xs text-slate-400">
          <span>/</span>
          <span className="font-medium text-slate-700">{getBreadcrumb()}</span>
          <span>·</span>
          <span className="text-slate-500">Fall Term 2026</span>
        </div>
      </div>

      {/* Zone 2: Global Search Bar */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            placeholder="Search students, roll numbers, staff, or notices..."
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors"
          />
          {globalSearch && (
            <button
              onClick={() => setGlobalSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Zone 3: Actions, Persona Switcher & Profile */}
      <div className="flex items-center gap-3">
        {/* Quick Action depending on role */}
        {(currentRole === 'admin' || currentRole === 'teacher') && (
          <div className="relative">
            <button
              onClick={() => setIsEnrollModalOpen(true)}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Enroll Student</span>
            </button>
          </div>
        )}

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            title="School Announcements"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">Recent Notices</span>
                <span className="text-[11px] text-slate-500">{notices.length} updates</span>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                {notices.slice(0, 4).map((n) => (
                  <div key={n.id} className="p-3 hover:bg-slate-50 transition-colors">
                    <p className="text-xs font-semibold text-slate-900 leading-snug line-clamp-1">
                      {n.title}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{n.content}</p>
                    <div className="flex items-center gap-2 mt-1.5 text-[10px] text-slate-400">
                      <span>{n.category}</span>
                      <span>·</span>
                      <span>{n.date}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-3 pt-2 border-t border-slate-100 text-center">
                <button
                  onClick={() => {
                    setShowNotifications(false);
                    setIsCreateNoticeModalOpen(true);
                  }}
                  className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold"
                >
                  + Post New Notice
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Persona Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="flex items-center gap-2.5 p-1 pl-2 pr-2.5 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all text-left"
          >
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200"
              referrerPolicy="no-referrer"
            />
            <div className="hidden sm:block text-left">
              <div className="text-xs font-bold text-slate-900 leading-tight">
                {currentUser.name}
              </div>
              <div className="text-[11px] text-slate-500 leading-none capitalize">
                {currentUser.role} · {currentUser.badge}
              </div>
            </div>
            <div className="text-slate-400 text-xs">▾</div>
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-xl shadow-xl p-2 z-50">
              <div className="px-3 py-2 border-b border-slate-100">
                <div className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                  Switch Active Portal Role
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Simulate experience across institutional personas:
                </div>
              </div>

              <div className="py-1 space-y-1">
                {allProfiles.map((profile) => (
                  <button
                    key={profile.id}
                    onClick={() => {
                      setCurrentRole(profile.role);
                      setShowRoleMenu(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg text-xs transition-colors ${
                      currentRole === profile.role
                        ? 'bg-indigo-50/80 text-indigo-900 font-semibold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <img
                      src={profile.avatarUrl}
                      alt={profile.name}
                      className="w-7 h-7 rounded-full object-cover shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="truncate">
                      <div className="text-xs font-medium text-slate-900">{profile.name}</div>
                      <div className="text-[11px] text-slate-500 capitalize">{profile.title}</div>
                    </div>
                    {currentRole === profile.role && (
                      <span className="ml-auto text-indigo-600 text-xs font-bold">✓</span>
                    )}
                  </button>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-100 mt-1 flex items-center justify-between px-2">
                <button
                  onClick={() => {
                    resetToDefaultData();
                    setShowRoleMenu(false);
                  }}
                  className="inline-flex items-center gap-1.5 text-[11px] text-slate-500 hover:text-slate-900 py-1"
                  title="Restores sample students, marks, and invoices"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Reset Demo Data</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
