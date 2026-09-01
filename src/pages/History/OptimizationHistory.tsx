import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  History,
  CheckCircle2,
  RotateCcw,
  Download,
  Filter,
  Search,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Building,
  Users,
  Sparkles,
  Layers,
  Check,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Select';
import { SearchBar } from '@/components/shared/SearchBar';
import { Modal } from '@/components/ui/Modal';
import { EmptyState } from '@/components/shared/EmptyState';

export interface HistoryRecord {
  id: string;
  date: string;
  problem: string;
  course: string;
  before: {
    room: string;
    capacity: number;
    conflict: number;
    utilization: number;
  };
  after: {
    room: string;
    capacity: number;
    conflict: number;
    utilization: number;
  };
  improvement: string;
  approvedBy: string;
  status: 'Approved' | 'Applied' | 'Reverted';
}

const INITIAL_HISTORY: HistoryRecord[] = [
  {
    id: 'HIST-001',
    date: '2026-09-01 09:15 AM',
    problem: 'DBMS Lab Capacity Conflict',
    course: 'CS351 - Database Management Systems Lab',
    before: {
      room: 'Lab B',
      capacity: 40,
      conflict: 1,
      utilization: 45,
    },
    after: {
      room: 'Lab A',
      capacity: 80,
      conflict: 0,
      utilization: 81,
    },
    improvement: '+36% Space Efficiency • 100% Conflict Resolved',
    approvedBy: 'Dr. Arvind Sharma (Dean)',
    status: 'Approved',
  },
  {
    id: 'HIST-002',
    date: '2026-08-30 02:30 PM',
    problem: 'Engineering Physics Auditorium Overcrowding',
    course: 'PH101 - Engineering Physics Lecture',
    before: {
      room: 'Room A101',
      capacity: 60,
      conflict: 1,
      utilization: 52,
    },
    after: {
      room: 'Room D102',
      capacity: 120,
      conflict: 0,
      utilization: 91,
    },
    improvement: '110 Students Safely Seated in Acoustic Hall',
    approvedBy: 'Campus Administrator',
    status: 'Applied',
  },
  {
    id: 'HIST-003',
    date: '2026-08-28 11:00 AM',
    problem: 'Double Booking Collision on Room F410',
    course: 'SEMINAR - Research Colloquium',
    before: {
      room: 'Room F410',
      capacity: 35,
      conflict: 1,
      utilization: 100,
    },
    after: {
      room: 'Room C305',
      capacity: 40,
      conflict: 0,
      utilization: 75,
    },
    improvement: 'Council Meeting Shifted to Conference Wing',
    approvedBy: 'Prof. Suresh Nair (HOD)',
    status: 'Applied',
  },
  {
    id: 'HIST-004',
    date: '2026-08-25 04:00 PM',
    problem: 'Underutilized Friday Afternoon Block Consolidation',
    course: 'Multiple 4th Year Electives',
    before: {
      room: 'Rooms E201, C305 (2 rooms)',
      capacity: 90,
      conflict: 0,
      utilization: 28,
    },
    after: {
      room: 'Room B204 (1 consolidated room)',
      capacity: 80,
      conflict: 0,
      utilization: 78,
    },
    improvement: 'Freed 1 Full Wing • ₹12,000/mo HVAC Savings',
    approvedBy: 'Campus Energy Officer',
    status: 'Applied',
  },
];

export const OptimizationHistory = () => {
  const navigate = useNavigate();
  const [historyList, setHistoryList] = useState<HistoryRecord[]>(INITIAL_HISTORY);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRecordForRollback, setSelectedRecordForRollback] = useState<HistoryRecord | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const filteredHistory = historyList.filter((item) => {
    const matchSearch =
      item.problem.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.approvedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.before.room.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.after.room.toLowerCase().includes(searchQuery.toLowerCase());

    const matchStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleRollback = () => {
    if (!selectedRecordForRollback) return;
    setHistoryList((prev) =>
      prev.map((h) =>
        h.id === selectedRecordForRollback.id
          ? { ...h, status: 'Reverted' }
          : h
      )
    );
    const title = selectedRecordForRollback.problem;
    setSelectedRecordForRollback(null);
    setToastMessage(`Rollback executed! "${title}" reverted to prior state.`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleExportCSV = () => {
    setToastMessage('Optimization Audit Log exported to CSV.');
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl border border-slate-700 flex items-center gap-3 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <p className="text-xs sm:text-sm font-medium">{toastMessage}</p>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Optimization History & Audit Log
            </h1>
            <Badge variant="purple">{historyList.length} Reallocations</Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Complete historical trail of approved timetable reallocations, space improvements, and authority sign-offs.
          </p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={handleExportCSV}
          icon={<Download className="w-4 h-4" />}
        >
          Export Audit Trail
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <Card padding="sm" className="space-y-3">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search history by problem, course, approved by, or room..."
            className="max-w-md w-full"
          />

          <div className="flex items-center gap-2">
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
                { value: 'all', label: 'All Statuses' },
                { value: 'Approved', label: 'Approved' },
                { value: 'Applied', label: 'Applied' },
                { value: 'Reverted', label: 'Reverted' },
              ]}
              className="py-1.5 text-xs w-40"
            />
          </div>
        </div>
      </Card>

      {/* ========================================================================= */}
      {/* 21. HISTORY CARDS LIST (Matching prompt example) */}
      {/* ========================================================================= */}
      {filteredHistory.length === 0 ? (
        <EmptyState
          icon={<History className="w-6 h-6" />}
          title="No History Found"
          description="No past optimization logs match your filter criteria."
        />
      ) : (
        <div className="space-y-4">
          {filteredHistory.map((item) => (
            <Card
              key={item.id}
              padding="md"
              hoverEffect
              className={`border-l-4 transition-all ${
                item.status === 'Approved'
                  ? 'border-l-blue-600'
                  : item.status === 'Applied'
                  ? 'border-l-emerald-600'
                  : 'border-l-slate-400 opacity-75'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-2.5 flex-1">
                  {/* Header: Date, Problem, Status */}
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="font-mono text-xs text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {item.date}
                    </span>
                    <Badge
                      variant={
                        item.status === 'Approved'
                          ? 'purple'
                          : item.status === 'Applied'
                          ? 'success'
                          : 'default'
                      }
                    >
                      {item.status}
                    </Badge>
                    <span className="font-mono text-xs text-slate-400 font-bold">{item.id}</span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                      {item.problem}
                    </h3>
                    <p className="text-xs text-slate-500 font-mono">{item.course}</p>
                  </div>

                  {/* Before vs After Summary (Matching Section 21 Example) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs">
                    {/* Before */}
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-bold text-slate-400">
                        Before:
                      </span>
                      <p className="font-bold text-slate-900 dark:text-slate-100">
                        {item.before.room} (Capacity: {item.before.capacity})
                      </p>
                      <p className="text-slate-500 text-[11px]">
                        Conflicts: <strong className="text-red-500">{item.before.conflict}</strong> • Util: {item.before.utilization}%
                      </p>
                    </div>

                    {/* After */}
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400">
                        After:
                      </span>
                      <p className="font-bold text-emerald-600 dark:text-emerald-400">
                        {item.after.room} (Capacity: {item.after.capacity})
                      </p>
                      <p className="text-slate-500 text-[11px]">
                        Conflicts: <strong className="text-emerald-600">0</strong> • Util: {item.after.utilization}%
                      </p>
                    </div>
                  </div>

                  {/* Improvement & Sign-off */}
                  <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 pt-1 flex-wrap gap-2">
                    <span className="font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      Improvement: {item.improvement}
                    </span>
                    <span className="font-medium">
                      Approved By: <strong className="text-slate-900 dark:text-slate-100">{item.approvedBy}</strong>
                    </span>
                  </div>
                </div>

                {/* Rollback Action */}
                <div className="shrink-0 flex items-center gap-2">
                  {item.status !== 'Reverted' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedRecordForRollback(item)}
                      icon={<RotateCcw className="w-3.5 h-3.5 text-slate-400 hover:text-red-500" />}
                    >
                      Rollback
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Rollback Confirmation Modal */}
      {selectedRecordForRollback && (
        <Modal
          open={!!selectedRecordForRollback}
          onClose={() => setSelectedRecordForRollback(null)}
          title="Confirm Rollback Allocation"
          description="Restore timetable to prior pre-optimization state."
          size="md"
          footer={
            <>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setSelectedRecordForRollback(null)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleRollback}
                icon={<RotateCcw className="w-3.5 h-3.5" />}
              >
                Confirm Rollback
              </Button>
            </>
          }
        >
          <div className="space-y-4 text-xs">
            <p className="text-slate-600 dark:text-slate-300">
              Are you sure you want to revert <strong>{selectedRecordForRollback.problem}</strong>?
            </p>
            <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 space-y-1 font-mono">
              <p>Current: <strong>{selectedRecordForRollback.after.room}</strong></p>
              <p>Reverting back to: <strong className="text-red-500">{selectedRecordForRollback.before.room}</strong></p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default OptimizationHistory;
