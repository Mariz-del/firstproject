import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { Notice } from '../../types/school';
import {
  Megaphone,
  Pin,
  Calendar,
  User,
  Plus,
  Trash2,
  Tag,
  AlertCircle,
  Users,
} from 'lucide-react';

export const NoticesView: React.FC = () => {
  const {
    notices,
    addNotice,
    deleteNotice,
    isCreateNoticeModalOpen,
    setIsCreateNoticeModalOpen,
    currentRole,
  } = useSchool();

  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [targetFilter, setTargetFilter] = useState<string>('all');

  // Form state
  const [newTitle, setNewTitle] = useState<string>('');
  const [newContent, setNewContent] = useState<string>('');
  const [newCategory, setNewCategory] = useState<'Academic' | 'Administrative' | 'Events' | 'Emergency'>('Academic');
  const [newAudience, setNewAudience] = useState<'All' | 'Teachers' | 'Students' | 'Parents'>('All');
  const [newPinned, setNewPinned] = useState<boolean>(false);

  const filteredNotices = notices.filter((n) => {
    const matchCat = categoryFilter === 'all' || n.category === categoryFilter;
    const matchAud = targetFilter === 'all' || n.targetAudience === targetFilter;
    return matchCat && matchAud;
  });

  const handleCreateNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    addNotice({
      title: newTitle,
      content: newContent,
      author: 'Dr. Arthur Vance',
      authorRole: 'Head of School',
      category: newCategory,
      targetAudience: newAudience,
      isPinned: newPinned,
    });

    setNewTitle('');
    setNewContent('');
    setIsCreateNoticeModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Institutional Communications & Notice Board
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Official circulars, academic notices, event announcements, and emergency campus bulletins.
          </p>
        </div>

        {(currentRole === 'admin' || currentRole === 'teacher') && (
          <button
            onClick={() => setIsCreateNoticeModalOpen(true)}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Publish Announcement</span>
          </button>
        )}
      </div>

      {/* Filter Segmented Controls */}
      <div className="p-4 bg-white border border-slate-200/80 rounded-xl shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Categories */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg overflow-x-auto">
          {['all', 'Academic', 'Administrative', 'Events', 'Emergency'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                categoryFilter === cat
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {cat === 'all' ? 'All Bulletins' : cat}
            </button>
          ))}
        </div>

        {/* Audience */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Recipient Audience:</span>
          <select
            value={targetFilter}
            onChange={(e) => setTargetFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="all">Everyone (School-Wide)</option>
            <option value="Teachers">Faculty & Staff</option>
            <option value="Students">Student Body</option>
            <option value="Parents">Parents & Guardians</option>
          </select>
        </div>
      </div>

      {/* Notices Feed */}
      <div className="space-y-4">
        {filteredNotices.length === 0 ? (
          <div className="py-12 text-center text-slate-400 bg-white border border-slate-200/80 rounded-xl">
            No notices match the selected category or audience filters.
          </div>
        ) : (
          filteredNotices.map((notice) => (
            <div
              key={notice.id}
              className={`p-6 rounded-xl border transition-all ${
                notice.isPinned
                  ? 'bg-indigo-50/30 border-indigo-200 shadow-xs'
                  : 'bg-white border-slate-200/80 shadow-xs'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    {notice.isPinned && (
                      <span className="flex items-center gap-1 font-semibold text-indigo-700">
                        <Pin className="w-3.5 h-3.5 fill-indigo-700" />
                        <span>Pinned Bulletin</span>
                      </span>
                    )}
                    {notice.isPinned && <span aria-hidden="true">·</span>}
                    <span className="font-semibold text-slate-700">{notice.category}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono tabular-nums">{notice.date}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-slate-500">Target: {notice.targetAudience}</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mt-1">
                    {notice.title}
                  </h3>
                </div>

                {currentRole === 'admin' && (
                  <button
                    onClick={() => deleteNotice(notice.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                    title="Delete Notice"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="mt-3 text-xs md:text-sm text-slate-700 leading-relaxed">
                {notice.content}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    Issued by <strong className="text-slate-800">{notice.author}</strong> ({notice.authorRole})
                  </span>
                </div>
                <div className="text-[11px] text-slate-400">
                  JOOUST Directorate of Corporate Communications & Public Relations
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Publish Notice Modal */}
      {isCreateNoticeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-xl max-w-lg w-full p-6">
            <h3 className="text-base font-bold text-slate-900">
              Publish Institutional Circular
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Broadcast an official announcement to school community members.
            </p>

            <form onSubmit={handleCreateNotice} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Circular Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Schedule for Mid-Term Laboratory Practicals"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  >
                    <option value="Academic">Academic</option>
                    <option value="Administrative">Administrative</option>
                    <option value="Events">Events</option>
                    <option value="Emergency">Emergency</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Audience
                  </label>
                  <select
                    value={newAudience}
                    onChange={(e) => setNewAudience(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  >
                    <option value="All">All Members</option>
                    <option value="Students">Students Only</option>
                    <option value="Teachers">Teachers Only</option>
                    <option value="Parents">Parents Only</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Circular Announcement Body
                </label>
                <textarea
                  rows={4}
                  placeholder="Provide complete circular details, date, instructions..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  required
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="pinned"
                  checked={newPinned}
                  onChange={(e) => setNewPinned(e.target.checked)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="pinned" className="text-xs text-slate-700 font-medium">
                  Pin this circular to top of community bulletin feed
                </label>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateNoticeModalOpen(false)}
                  className="px-3.5 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
                >
                  Broadcast Circular
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
