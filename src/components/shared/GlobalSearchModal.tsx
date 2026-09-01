import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  DoorOpen,
  FlaskConical,
  Users,
  GraduationCap,
  BookOpen,
  X,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { mockRooms, mockLabs, mockFacultyList, mockClassesList } from '@/data/mockData';

interface SearchResultItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'Rooms' | 'Labs' | 'Faculty' | 'Courses' | 'Classes';
  route: string;
  badge?: string;
}

interface GlobalSearchModalProps {
  open: boolean;
  onClose: () => void;
}

export const GlobalSearchModal = ({ open, onClose }: GlobalSearchModalProps) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  // Keyboard shortcut listener (ESC to close)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  // Aggregate and search across all 5 domains
  const searchResults: SearchResultItem[] = React.useMemo(() => {
    if (!query.trim()) {
      return [
        { id: 'R1', title: 'Room A101', subtitle: 'Block A, Floor 1 • 60 Capacity', category: 'Rooms', route: '/rooms/R001', badge: 'Classroom' },
        { id: 'L1', title: 'DBMS Lab', subtitle: 'Block A, Floor 0 • 40 Capacity', category: 'Labs', route: '/labs', badge: 'Computer Lab' },
        { id: 'F1', title: 'Dr. Priya Mehta', subtitle: 'Computer Science • Assistant Professor', category: 'Faculty', route: '/faculty', badge: 'Faculty' },
        { id: 'C1', title: 'CS351 - DBMS Lab', subtitle: 'Year 3, Div A • 65 Students', category: 'Classes', route: '/classes', badge: 'Course' },
      ];
    }

    const q = query.toLowerCase();
    const results: SearchResultItem[] = [];

    // 1. Rooms
    mockRooms.forEach((r) => {
      if (r.name.toLowerCase().includes(q) || r.id.toLowerCase().includes(q) || r.building.toLowerCase().includes(q)) {
        results.push({
          id: r.id,
          title: r.name,
          subtitle: `${r.building}, Floor ${r.floor} • Capacity: ${r.capacity}`,
          category: 'Rooms',
          route: `/rooms/${r.id}`,
          badge: r.type,
        });
      }
    });

    // 2. Labs
    mockLabs.forEach((l) => {
      if (l.name.toLowerCase().includes(q) || l.department.toLowerCase().includes(q)) {
        results.push({
          id: l.id,
          title: l.name,
          subtitle: `${l.department} • Capacity: ${l.capacity} (${l.safetyRating} Safety)`,
          category: 'Labs',
          route: '/labs',
          badge: 'Lab',
        });
      }
    });

    // 3. Faculty
    mockFacultyList.forEach((f) => {
      if (f.name.toLowerCase().includes(q) || f.department.toLowerCase().includes(q) || f.id.toLowerCase().includes(q)) {
        results.push({
          id: f.id,
          title: f.name,
          subtitle: `${f.designation} • Dept of ${f.department}`,
          category: 'Faculty',
          route: '/faculty',
          badge: `${f.workload}/${f.maxWorkload} hrs`,
        });
      }
    });

    // 4. Courses & Classes
    mockClassesList.forEach((c) => {
      if (c.code.toLowerCase().includes(q) || c.subject.toLowerCase().includes(q) || c.faculty.toLowerCase().includes(q)) {
        results.push({
          id: c.id,
          title: `${c.code}: ${c.subject}`,
          subtitle: `Year ${c.year} (${c.division}) • ${c.students} Students • ${c.faculty}`,
          category: 'Classes',
          route: '/classes',
          badge: c.assignedRoom,
        });
      }
    });

    return results;
  }, [query]);

  // Group by category
  const categories = ['Rooms', 'Labs', 'Faculty', 'Classes'] as const;

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-xs" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Search Header Input */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search rooms, laboratories, faculty, courses, and classes..."
            className="w-full bg-transparent text-sm sm:text-base font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 rounded border border-slate-200 dark:border-slate-700 hidden sm:inline-block">
            ESC
          </span>
        </div>

        {/* Categorized Results */}
        <div className="max-h-[60vh] overflow-y-auto p-3 space-y-4">
          {searchResults.length === 0 ? (
            <div className="p-8 text-center text-slate-400 space-y-1">
              <p className="text-sm font-semibold">No campus resources found</p>
              <p className="text-xs">Try searching for "A101", "DBMS", "Dr. Rajesh", or "CS201".</p>
            </div>
          ) : (
            categories.map((cat) => {
              const items = searchResults.filter((r) => r.category === cat);
              if (items.length === 0) return null;

              return (
                <div key={cat} className="space-y-1.5">
                  <span className="px-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    {cat} ({items.length})
                  </span>
                  <div className="space-y-1">
                    {items.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          onClose();
                          navigate(item.route);
                        }}
                        className="w-full p-2.5 rounded-xl hover:bg-blue-50/80 dark:hover:bg-blue-950/40 flex items-center justify-between text-left transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            {cat === 'Rooms' && <DoorOpen className="w-4 h-4" />}
                            {cat === 'Labs' && <FlaskConical className="w-4 h-4" />}
                            {cat === 'Faculty' && <Users className="w-4 h-4" />}
                            {cat === 'Classes' && <GraduationCap className="w-4 h-4" />}
                          </div>
                          <div>
                            <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {item.title}
                            </p>
                            <p className="text-[11px] text-slate-500">{item.subtitle}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {item.badge && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                              {item.badge}
                            </span>
                          )}
                          <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-600 transition-colors" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <span>Search across 24 Rooms, 8 Labs, 6 Faculty, and Courses</span>
          <span>Press ESC to dismiss</span>
        </div>
      </div>
    </div>
  );
};

export default GlobalSearchModal;
