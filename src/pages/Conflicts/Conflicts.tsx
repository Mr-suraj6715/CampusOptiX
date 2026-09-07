import React, { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  AlertOctagon,
  CheckCircle2,
  Clock,
  Wrench,
  Sparkles,
  Filter,
  ArrowRight,
  ShieldAlert,
  Users,
  DoorOpen,
  Calendar,
  Layers,
  AlertTriangle,
  Zap,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Tabs } from '@/components/ui/Tabs';
import { Modal } from '@/components/ui/Modal';
import { EmptyState } from '@/components/shared/EmptyState';
import { mockDetailedConflicts } from '@/data/mockData';
import type { DetailedConflict, ConflictType, ConflictSeverity, ConflictStatus } from '@/types';
import { formatDate, timeAgo } from '@/utils/cn';

export const Conflicts = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';

  const [conflictsList, setConflictsList] = useState<DetailedConflict[]>(mockDetailedConflicts);
  const [statusTab, setStatusTab] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>(initialCategory);
  const [severityFilter, setSeverityFilter] = useState<string>('all');

  // Selected Conflict for Recommendation Modal (Section 11)
  const [selectedConflict, setSelectedConflict] = useState<DetailedConflict | null>(null);
  const [resolvingProgress, setResolvingProgress] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const categories: ConflictType[] = [
    'Capacity Conflict',
    'Room-Time Conflict',
    'Faculty-Time Conflict',
    'Equipment Mismatch',
    'Room Type Mismatch',
    'Resource Unavailable',
  ];

  const filteredConflicts = useMemo(() => {
    return conflictsList.filter((c) => {
      const matchStatus = statusTab === 'all' || c.status === statusTab;
      const matchCategory = categoryFilter === 'all' || c.category === categoryFilter;
      const matchSeverity = severityFilter === 'all' || c.severity === severityFilter;

      return matchStatus && matchCategory && matchSeverity;
    });
  }, [conflictsList, statusTab, categoryFilter, severityFilter]);

  const openCount = conflictsList.filter((c) => c.status === 'open').length;
  const criticalCount = conflictsList.filter((c) => c.severity === 'CRITICAL' && c.status === 'open').length;

  const handleExecuteResolution = () => {
    if (!selectedConflict) return;
    setResolvingProgress(true);

    setTimeout(() => {
      setResolvingProgress(false);
      setConflictsList((prev) =>
        prev.map((c) =>
          c.id === selectedConflict.id
            ? { ...c, status: 'resolved', resolvedAt: new Date().toISOString() }
            : c
        )
      );
      const title = selectedConflict.course;
      setSelectedConflict(null);
      setToastMessage(`Action deployed! "${title}" conflict resolved.`);
      setTimeout(() => setToastMessage(null), 4000);
    }, 1200);
  };

  const getSeverityBadge = (severity: ConflictSeverity) => {
    switch (severity) {
      case 'CRITICAL':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-red-100 text-red-700 dark:bg-red-950/80 dark:text-red-300 border border-red-300 dark:border-red-800 animate-pulse">
            <AlertTriangle className="w-3 h-3" />
            CRITICAL
          </span>
        );
      case 'HIGH':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-100 text-orange-700 dark:bg-orange-950/80 dark:text-orange-300 border border-orange-300 dark:border-orange-800">
            HIGH
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
            MEDIUM
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300 border border-blue-300 dark:border-blue-800">
            LOW
          </span>
        );
    }
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
            <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-rose-600 via-red-600 to-amber-600 dark:from-rose-400 dark:via-red-300 dark:to-amber-300 bg-clip-text text-transparent">
              Campus Conflict Management Dashboard
            </h1>
            {criticalCount > 0 && <Badge variant="error">{criticalCount} Critical</Badge>}
            <Badge variant="warning">{openCount} Active</Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 mt-1 font-medium">
            Automated conflict resolution across capacity limits, timetable overlaps, instructor availability, and equipment needs.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => navigate('/optimizer')}
          icon={<Sparkles className="w-4 h-4" />}
        >
          Auto-Resolve All with AI
        </Button>
      </div>

      {/* Conflict Category Filter Pills (Section 11 Requirements) */}
      <Card padding="sm" className="space-y-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 mr-2 shrink-0">
            Categories:
          </span>
          <button
            onClick={() => setCategoryFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              categoryFilter === 'all'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-200/80 dark:bg-slate-800 text-slate-900 dark:text-slate-100 hover:bg-slate-300 dark:hover:bg-slate-700 border border-slate-300/60 dark:border-slate-700'
            }`}
          >
            All Categories ({conflictsList.length})
          </button>
          {categories.map((cat) => {
            const count = conflictsList.filter((c) => c.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  categoryFilter === cat
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-200/80 dark:bg-slate-800 text-slate-900 dark:text-slate-100 hover:bg-slate-300 dark:hover:bg-slate-700 border border-slate-300/60 dark:border-slate-700'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-2 flex-wrap gap-2">
          <Tabs
            tabs={[
              { id: 'all', label: 'All Statuses' },
              { id: 'open', label: 'Open', count: openCount },
              { id: 'in-progress', label: 'In Progress' },
              { id: 'resolved', label: 'Resolved' },
            ]}
            activeTab={statusTab}
            onChange={setStatusTab}
            variant="pills"
          />

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Severity Filter:</span>
            <div className="flex items-center gap-1">
              {['all', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((sev) => (
                <button
                  key={sev}
                  onClick={() => setSeverityFilter(sev)}
                  className={`px-2.5 py-0.5 rounded-lg text-xs font-bold transition-all ${
                    severityFilter === sev
                      ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                      : 'text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800'
                  }`}
                >
                  {sev}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Conflicts Cards List (Section 11 Format) */}
      {filteredConflicts.length === 0 ? (
        <EmptyState
          icon={<CheckCircle2 className="w-6 h-6 text-emerald-500" />}
          title="Zero Conflicts Found"
          description="All clear! No schedule or capacity bottlenecks match your current filter."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredConflicts.map((conflict) => (
            <Card
              key={conflict.id}
              padding="md"
              className={`flex flex-col justify-between space-y-4 border-l-4 transition-all ${
                conflict.severity === 'CRITICAL'
                  ? 'border-l-red-600 bg-red-50/10'
                  : conflict.severity === 'HIGH'
                  ? 'border-l-orange-500 bg-orange-50/10'
                  : 'border-l-amber-500 bg-amber-50/10'
              }`}
            >
              <div className="space-y-3">
                {/* Header: Severity & Category */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {getSeverityBadge(conflict.severity)}
                    <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300">{conflict.id}</span>
                  </div>
                  <Badge variant="purple">{conflict.category}</Badge>
                </div>

                {/* Course Name */}
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    {conflict.course}
                  </h3>
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">{conflict.subject}</p>
                </div>

                {/* Assigned Room & Capacity & Students (Matching prompt example) */}
                <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-700 dark:text-slate-300 font-bold uppercase">Assigned Room</span>
                    <p className="font-bold text-slate-900 dark:text-slate-100">{conflict.room}</p>
                    {conflict.roomCapacity && (
                      <p className="text-slate-700 dark:text-slate-300 text-xs font-medium">Room Capacity: <strong className="text-slate-950 dark:text-white font-bold">{conflict.roomCapacity}</strong></p>
                    )}
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-700 dark:text-slate-300 font-bold uppercase">Enrolled Cohort</span>
                    <p className="font-bold text-slate-900 dark:text-slate-100">
                      {conflict.studentCount ? `${conflict.studentCount} Students` : 'Multi-Section'}
                    </p>
                    <p className="text-slate-700 dark:text-slate-300 text-xs font-mono font-medium">{conflict.time}</p>
                  </div>
                </div>

                {/* Problem Statement Box */}
                <div className="p-3 rounded-xl bg-red-50/80 dark:bg-red-950/40 border border-red-200 dark:border-red-900 space-y-1 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-red-900 dark:text-red-200">
                    <AlertOctagon className="w-3.5 h-3.5 text-red-600" />
                    <span>Problem Statement:</span>
                  </div>
                  <p className="text-red-800 dark:text-red-300 leading-relaxed font-medium">
                    "{conflict.problem}"
                  </p>
                </div>
              </div>

              {/* Action Button: [View Recommendation] */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Detected {timeAgo(conflict.detectedAt)}
                </span>
                <Button
                  variant={conflict.severity === 'CRITICAL' ? 'danger' : 'primary'}
                  size="sm"
                  onClick={() => setSelectedConflict(conflict)}
                  icon={<Sparkles className="w-3.5 h-3.5" />}
                >
                  View Recommendation
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Recommendation & Resolution Modal (Section 11 Requirement) */}
      {selectedConflict && (
        <Modal
          open={!!selectedConflict}
          onClose={() => setSelectedConflict(null)}
          title={`Conflict Resolution: ${selectedConflict.course}`}
          description={`Category: ${selectedConflict.category} • ${selectedConflict.time}`}
          size="md"
          footer={
            <div className="flex items-center justify-between w-full">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setSelectedConflict(null)}
                disabled={resolvingProgress}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleExecuteResolution}
                loading={resolvingProgress}
                icon={<CheckCircle2 className="w-3.5 h-3.5" />}
              >
                Apply Recommended Action
              </Button>
            </div>
          }
        >
          <div className="space-y-4 text-xs">
            {/* Problem Box */}
            <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 space-y-1">
              <span className="text-[11px] font-bold text-red-900 dark:text-red-200 uppercase">
                Detected Bottleneck:
              </span>
              <p className="text-red-800 dark:text-red-300 font-semibold leading-relaxed">
                "{selectedConflict.problem}"
              </p>
              <div className="flex items-center gap-4 text-[11px] text-red-700 dark:text-red-400 pt-1 font-mono">
                <span>Room: {selectedConflict.room}</span>
                {selectedConflict.studentCount && (
                  <span>Students: {selectedConflict.studentCount} vs Cap {selectedConflict.roomCapacity}</span>
                )}
              </div>
            </div>

            {/* AI Recommended Action Plan */}
            <div className="p-4 rounded-xl bg-blue-50/80 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900 space-y-2">
              <div className="flex items-center gap-2 text-blue-900 dark:text-blue-200 font-bold text-sm">
                <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>AI Recommended Action:</span>
              </div>
              <p className="text-blue-950 dark:text-blue-100 text-xs leading-relaxed font-medium">
                {selectedConflict.recommendedAction}
              </p>
            </div>

            {/* Action Details */}
            <div className="space-y-1.5 text-slate-800 dark:text-slate-200">
              <p className="font-bold text-slate-950 dark:text-white">
                Automated System Adjustments:
              </p>
              <ul className="list-disc pl-5 space-y-1 font-medium">
                <li>Reconfigures master schedule grid and frees up bottlenecked room.</li>
                <li>Sends immediate calendar notifications to affected students & faculty.</li>
                <li>Recalculates department resource efficiency and updates telemetry.</li>
              </ul>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Conflicts;
