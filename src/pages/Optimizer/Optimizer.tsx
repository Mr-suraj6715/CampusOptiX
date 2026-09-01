import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Zap,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Building,
  Users,
  Clock,
  Layers,
  Check,
  X,
  FileText,
  BarChart2,
  TrendingUp,
  RotateCcw,
  Cpu,
  HelpCircle,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Modal } from '@/components/ui/Modal';

interface CandidateRoom {
  name: string;
  building: string;
  floor: number;
  capacity: number;
  equipment: string;
  timeStatus: 'Available' | 'Conflict' | 'Partial';
  score: number;
  pros: string[];
  isRecommended?: boolean;
}

interface OptimizerCase {
  id: string;
  course: string;
  courseCode: string;
  students: number;
  time: string;
  day: string;
  currentRoom: string;
  currentCapacity: number;
  faculty: string;
  candidates: CandidateRoom[];
  recommendedCandidate: string;
  beforeStats: {
    room: string;
    capacity: number;
    students: number;
    conflicts: number;
    utilization: number;
  };
  afterStats: {
    room: string;
    capacity: number;
    students: number;
    conflicts: number;
    utilization: number;
  };
  explanation: string[];
  fullAnalysisNotes: string[];
}

const OPTIMIZER_CASES: OptimizerCase[] = [
  {
    id: 'CASE-1',
    course: 'DBMS Lab',
    courseCode: 'CS351',
    students: 65,
    time: '2:00 PM (14:00 - 16:00)',
    day: 'Tuesday',
    currentRoom: 'Lab B',
    currentCapacity: 40,
    faculty: 'Dr. Priya Mehta',
    recommendedCandidate: 'Lab A',
    candidates: [
      {
        name: 'Lab A',
        building: 'Block A',
        floor: 1,
        capacity: 80,
        equipment: 'Available (80 DB Workstations + LAN)',
        timeStatus: 'Available',
        score: 94,
        pros: ['Ample capacity for 65 students', '1:1 Workstation ratio', 'Adjacent to Faculty Office'],
        isRecommended: true,
      },
      {
        name: 'Lab C',
        building: 'Block C',
        floor: 2,
        capacity: 70,
        equipment: 'Available (70 Standard PCs)',
        timeStatus: 'Available',
        score: 82,
        pros: ['Adequate capacity', 'Full LAN connectivity'],
      },
      {
        name: 'Room D102',
        building: 'Block D',
        floor: 1,
        capacity: 120,
        equipment: 'Partial (Theory Hall - No DB Workstations)',
        timeStatus: 'Available',
        score: 58,
        pros: ['High seating capacity'],
      },
    ],
    beforeStats: {
      room: 'Lab B',
      capacity: 40,
      students: 65,
      conflicts: 1,
      utilization: 45,
    },
    afterStats: {
      room: 'Lab A',
      capacity: 80,
      students: 65,
      conflicts: 0,
      utilization: 81,
    },
    explanation: [
      'Capacity is sufficient (80 seats for 65 students)',
      'Required equipment available (High-performance DB workstations & Gigabit LAN)',
      'Room available at selected time (Tuesday 2:00 PM slot is 100% free)',
      'No faculty conflict (Dr. Priya Mehta has zero overlapping lectures)',
      'Better utilization (Increases Lab A utilization from 22% to 81%)',
      'No new conflict created (Zero downstream collisions across the campus)',
    ],
    fullAnalysisNotes: [
      'Heuristic constraint satisfaction completed in 42ms.',
      'Fire safety compliance score upgraded from 40% (Fail) to 98% (Pass).',
      'Transit penalty: 0 minutes (Both Lab A and Lab B reside within Block A).',
      'Estimated student satisfaction improvement: +38%.',
    ],
  },
  {
    id: 'CASE-2',
    course: 'Engineering Physics',
    courseCode: 'PH101',
    students: 110,
    time: '10:00 AM (10:00 - 11:00)',
    day: 'Thursday',
    currentRoom: 'Room A101',
    currentCapacity: 60,
    faculty: 'Dr. Mohan Rao',
    recommendedCandidate: 'Room D102',
    candidates: [
      {
        name: 'Room D102',
        building: 'Block D',
        floor: 1,
        capacity: 120,
        equipment: 'Available (Dual Projector + Sound)',
        timeStatus: 'Available',
        score: 96,
        pros: ['Comfortably seats 110 students', 'Acoustic mic array installed'],
        isRecommended: true,
      },
      {
        name: 'Room B204',
        building: 'Block B',
        floor: 2,
        capacity: 80,
        equipment: 'Available',
        timeStatus: 'Available',
        score: 65,
        pros: ['Modern audio setup'],
      },
    ],
    beforeStats: {
      room: 'Room A101',
      capacity: 60,
      students: 110,
      conflicts: 1,
      utilization: 52,
    },
    afterStats: {
      room: 'Room D102',
      capacity: 120,
      students: 110,
      conflicts: 0,
      utilization: 91,
    },
    explanation: [
      'Capacity is sufficient (120 seats easily holds 110 cohort)',
      'Acoustic and presentation systems verified functional',
      'Room D102 is completely unbooked on Thursday 10:00 AM',
      'Faculty travel time between Block D and Physics Dept is minimal',
      'Zero new scheduling bottlenecks created',
    ],
    fullAnalysisNotes: [
      'Room A101 had a 183% overcrowding hazard.',
      'Auditorium D102 has dual projector screens suitable for complex physics diagrams.',
    ],
  },
];

export const Optimizer = () => {
  const navigate = useNavigate();
  const [selectedCaseIndex, setSelectedCaseIndex] = useState(0);
  const currentCase = OPTIMIZER_CASES[selectedCaseIndex];

  // Approval States
  const [approvalStatus, setApprovalStatus] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleCaseChange = (index: number) => {
    setSelectedCaseIndex(index);
    setApprovalStatus('pending');
  };

  const handleApprove = () => {
    setIsConfirmModalOpen(true);
  };

  const handleConfirmApproval = () => {
    setApprovalStatus('approved');
    setIsConfirmModalOpen(false);
    setToastMessage(`Allocation approved! Official schedule updated: ${currentCase.course} moved to ${currentCase.recommendedCandidate}.`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleReject = () => {
    setApprovalStatus('rejected');
    setToastMessage(`Allocation rejected for ${currentCase.course}. Optimization solver will generate alternative candidates.`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl border border-slate-700 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <p className="text-xs sm:text-sm font-medium">{toastMessage}</p>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Campus AI Resource Optimizer
            </h1>
            <Badge variant="purple">Constraint Solver v2.4</Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Explainable AI decision support for resolving capacity bottlenecks and timetable anomalies.
          </p>
        </div>

        {/* Case Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Scenario:</span>
          {OPTIMIZER_CASES.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => handleCaseChange(idx)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedCaseIndex === idx
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {item.course}
            </button>
          ))}
        </div>
      </div>

      {/* Approval Status Banner if changed */}
      {approvalStatus === 'approved' && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-500 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-emerald-900 dark:text-emerald-200 animate-in fade-in shadow-sm">
          <div className="flex items-center gap-2.5 font-bold text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Allocation officially approved & staged! Master Timetable has been updated.</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setApprovalStatus('pending')}
              className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 underline"
            >
              Reset State
            </button>
            <Button
              variant="primary"
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
              onClick={() => navigate('/timetable')}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              View Updated Timetable →
            </Button>
          </div>
        </div>
      )}

      {approvalStatus === 'rejected' && (
        <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 flex items-center justify-between text-xs text-amber-800 dark:text-amber-300 animate-in fade-in">
          <div className="flex items-center gap-2 font-bold">
            <X className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>Allocation proposal rejected. Alternate candidates are being recalibrated.</span>
          </div>
          <button
            onClick={() => setApprovalStatus('pending')}
            className="text-[11px] font-semibold text-amber-700 underline"
          >
            Reset Status
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 12. OPTIMIZER 3-COLUMN LAYOUT: (LEFT: Conflict, CENTER: Candidates, RIGHT: Rec) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* LEFT SIDE: Conflict details (4 cols) */}
        <Card className="lg:col-span-4 border-l-4 border-l-red-600 flex flex-col justify-between" padding="md">
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-red-600 dark:text-red-400 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                DETECTED CONFLICT
              </span>
              <Badge variant="error">CRITICAL</Badge>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                {currentCase.course}
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                {currentCase.courseCode} • {currentCase.faculty}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-red-50/60 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-xs">
              <div>
                <span className="text-[10px] font-semibold uppercase text-slate-400">Enrolled Students</span>
                <p className="text-base font-extrabold text-red-600 dark:text-red-400">
                  {currentCase.students} Students
                </p>
              </div>
              <div>
                <span className="text-[10px] font-semibold uppercase text-slate-400">Scheduled Time</span>
                <p className="font-bold text-slate-900 dark:text-slate-100">
                  {currentCase.time}
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Assigned Room:</span>
                <span className="font-bold text-slate-900 dark:text-slate-100 font-mono">
                  {currentCase.currentRoom}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Room Capacity:</span>
                <span className="font-bold text-red-600 dark:text-red-400">
                  {currentCase.currentCapacity} Seats
                </span>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-slate-200 dark:border-slate-700">
                <span className="text-slate-500 font-medium">Deficit / Overload:</span>
                <span className="font-extrabold text-red-600 dark:text-red-400">
                  +{currentCase.students - currentCase.currentCapacity} Students (162%)
                </span>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-red-100/70 dark:bg-red-950/60 text-red-900 dark:text-red-200 text-xs font-semibold">
              Problem: Room capacity is insufficient for the enrolled student cohort.
            </div>
          </div>
        </Card>

        {/* CENTER: Candidate rooms (4 cols) */}
        <Card className="lg:col-span-4 flex flex-col justify-between" padding="md">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <CardTitle>Candidate Rooms</CardTitle>
              <Badge variant="slate">{currentCase.candidates.length} Evaluated</Badge>
            </div>
            <p className="text-xs text-slate-500">
              Evaluated spaces ranked by capacity buffer, hardware fit, and distance.
            </p>

            <div className="space-y-2.5">
              {currentCase.candidates.map((cand, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border transition-all ${
                    cand.isRecommended
                      ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30 ring-2 ring-blue-500/30'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/30'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                          {cand.name}
                        </span>
                        {cand.isRecommended && (
                          <Badge variant="success">Best Match</Badge>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400">{cand.building}, Fl {cand.floor}</span>
                    </div>

                    <div className="text-right">
                      <span className="font-mono text-xs font-extrabold text-blue-600 dark:text-blue-400">
                        Score: {cand.score}/100
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-1 text-[11px] text-slate-600 dark:text-slate-400 pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                    <div>
                      <span className="text-[10px] text-slate-400">Capacity:</span>
                      <p className="font-bold text-slate-800 dark:text-slate-200">{cand.capacity}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400">Equipment:</span>
                      <p className="font-semibold text-emerald-600 dark:text-emerald-400">Available</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400">Time:</span>
                      <p className="font-semibold text-emerald-600 dark:text-emerald-400">Available</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* RIGHT SIDE: Recommended allocation (4 cols) */}
        <Card className="lg:col-span-4 border-2 border-blue-500 bg-gradient-to-b from-blue-50/30 to-white dark:from-blue-950/20 dark:to-slate-900 flex flex-col justify-between" padding="md">
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-blue-500 animate-pulse" />
                AI RECOMMENDATION
              </span>
              <Badge variant="purple">94% Confidence</Badge>
            </div>

            <div className="p-4 rounded-xl bg-blue-600 text-white shadow-md text-center space-y-1">
              <span className="text-[11px] uppercase tracking-wider text-blue-200 font-bold">
                Proposed Action
              </span>
              <h3 className="text-base font-extrabold tracking-tight">
                MOVE {currentCase.course.toUpperCase()} → {currentCase.recommendedCandidate.toUpperCase()}
              </h3>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
              <p className="font-semibold text-slate-900 dark:text-slate-100">
                Key Decision Drivers:
              </p>
              <ul className="space-y-1.5 text-slate-600 dark:text-slate-300">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>80 seats accommodates full 65 batch safely.</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Zero schedule shift required (Keep 2:00 PM slot).</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Hardware & Oracle DB suite fully configured.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Section 15: Approval Actions in Recommended Box */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <div className="flex items-center gap-2">
              <Button
                variant="primary"
                size="sm"
                className="flex-1"
                onClick={handleApprove}
                disabled={approvalStatus === 'approved'}
                icon={<Check className="w-3.5 h-3.5" />}
              >
                {approvalStatus === 'approved' ? 'Approved' : 'Approve Change'}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleReject}
                disabled={approvalStatus === 'rejected'}
                icon={<X className="w-3.5 h-3.5" />}
              >
                Reject
              </Button>
            </div>
            <button
              onClick={() => setIsAnalysisModalOpen(true)}
              className="w-full text-center text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline"
            >
              View Full Analysis →
            </button>
          </div>
        </Card>
      </div>

      {/* ========================================================================= */}
      {/* 13. EXPLAINABLE RECOMMENDATION UI ("Why this recommendation?" panel) */}
      {/* ========================================================================= */}
      <Card padding="md" className="space-y-4">
        <CardHeader>
          <div>
            <div className="flex items-center gap-2">
              <CardTitle>Why this recommendation?</CardTitle>
              <Badge variant="success">AI Confidence: 94 / 100</Badge>
            </div>
            <CardDescription>
              Transparent rule-validation audit ensuring zero policy or physical constraints are violated
            </CardDescription>
          </div>
        </CardHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {currentCase.explanation.map((reason, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50/50 dark:bg-emerald-950/20 flex items-start gap-2.5"
            >
              <div className="p-1 rounded-full bg-emerald-600 text-white shrink-0 mt-0.5">
                <Check className="w-3 h-3" />
              </div>
              <p className="text-xs font-semibold text-emerald-900 dark:text-emerald-200 leading-relaxed">
                {reason}
              </p>
            </div>
          ))}
        </div>
      </Card>

      {/* ========================================================================= */}
      {/* 14. BEFORE VS AFTER (Highly visual comparison with improvement indicators) */}
      {/* ========================================================================= */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            Before vs After Reallocation Impact
          </h2>
          <span className="text-xs text-slate-400">Simulation Comparison Model</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* BEFORE CARD */}
          <Card padding="md" className="border-l-4 border-l-red-500 bg-red-50/10 dark:bg-red-950/10 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-red-600 dark:text-red-400">
                BEFORE ALLOCATION
              </span>
              <Badge variant="error">Current State</Badge>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Room</span>
                <p className="text-base font-bold text-slate-900 dark:text-slate-100 font-mono mt-0.5">
                  {currentCase.beforeStats.room}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Capacity</span>
                <p className="text-base font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                  {currentCase.beforeStats.capacity}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Students</span>
                <p className="text-base font-bold text-red-600 dark:text-red-400 mt-0.5">
                  {currentCase.beforeStats.students}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Conflict Count</span>
                <p className="text-base font-bold text-red-600 dark:text-red-400 mt-0.5">
                  {currentCase.beforeStats.conflicts}
                </p>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-600 dark:text-slate-400">Baseline Room Utilization</span>
                <span className="text-slate-900 dark:text-slate-100 font-bold">{currentCase.beforeStats.utilization}%</span>
              </div>
              <ProgressBar value={currentCase.beforeStats.utilization} size="md" color="bg-red-500" />
            </div>
          </Card>

          {/* AFTER CARD */}
          <Card padding="md" className="border-l-4 border-l-emerald-500 bg-emerald-50/10 dark:bg-emerald-950/10 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                AFTER ALLOCATION
              </span>
              <Badge variant="success">Optimized State</Badge>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Room</span>
                <p className="text-base font-bold text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">
                  {currentCase.afterStats.room}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Capacity</span>
                <p className="text-base font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                  {currentCase.afterStats.capacity}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Students</span>
                <p className="text-base font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                  {currentCase.afterStats.students}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Conflict Count</span>
                <p className="text-base font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                  {currentCase.afterStats.conflicts}
                </p>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-600 dark:text-slate-400">Optimized Room Utilization</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">{currentCase.afterStats.utilization}%</span>
              </div>
              <ProgressBar value={currentCase.afterStats.utilization} size="md" color="bg-emerald-500" />
            </div>
          </Card>
        </div>

        {/* Improvement Indicators Row (Matching prompt format) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div className="p-3.5 rounded-xl bg-slate-900 text-white flex items-center justify-between text-xs">
            <span className="text-slate-300 font-medium">Conflict Resolution:</span>
            <div className="flex items-center gap-1.5 font-bold">
              <span className="text-red-400">1</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-emerald-400 text-sm">0 Conflicts</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900 text-white flex items-center justify-between text-xs">
            <span className="text-slate-300 font-medium">Utilization Improvement:</span>
            <div className="flex items-center gap-1.5 font-bold">
              <span className="text-amber-400">{currentCase.beforeStats.utilization}%</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-emerald-400 text-sm">{currentCase.afterStats.utilization}%</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900 text-white flex items-center justify-between text-xs">
            <span className="text-slate-300 font-medium">Safety Hazard Status:</span>
            <div className="flex items-center gap-1.5 font-bold">
              <span className="text-red-400">Violation</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-emerald-400 text-sm">100% Compliant</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 15. APPROVAL CONFIRMATION MODAL */}
      {/* ========================================================================= */}
      {isConfirmModalOpen && (
        <Modal
          open={isConfirmModalOpen}
          onClose={() => setIsConfirmModalOpen(false)}
          title="Confirm Allocation Change"
          description="Are you sure you want to apply this allocation?"
          size="md"
          footer={
            <>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsConfirmModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleConfirmApproval}
                icon={<Check className="w-3.5 h-3.5" />}
              >
                Yes, Apply Allocation
              </Button>
            </>
          }
        >
          <div className="space-y-4 text-xs">
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Applying this allocation will officially modify the timetable database and reassign <strong>{currentCase.students} students</strong> enrolled in <strong>{currentCase.course}</strong> from <strong>{currentCase.currentRoom}</strong> to <strong>{currentCase.recommendedCandidate}</strong>.
            </p>

            <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 space-y-2">
              <p className="font-bold text-blue-900 dark:text-blue-200">
                Action Highlights:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-blue-800 dark:text-blue-300">
                <li>Immediate schedule update across student & faculty portals.</li>
                <li>Frees up {currentCase.currentRoom} for smaller seminar cohorts.</li>
                <li>Resolves critical capacity conflict count from 1 → 0.</li>
              </ul>
            </div>
          </div>
        </Modal>
      )}

      {/* Full Analysis Modal */}
      {isAnalysisModalOpen && (
        <Modal
          open={isAnalysisModalOpen}
          onClose={() => setIsAnalysisModalOpen(false)}
          title={`Full Heuristic Analysis: ${currentCase.course}`}
          description="Detailed multi-objective constraint weights and scoring report."
          size="lg"
          footer={
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsAnalysisModalOpen(false)}
            >
              Close Analysis
            </Button>
          }
        >
          <div className="space-y-4 text-xs">
            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 dark:text-slate-100">
                Solver Constraint Validations:
              </h4>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-600 dark:text-slate-300">
                {currentCase.fullAnalysisNotes.map((note, i) => (
                  <li key={i}>{note}</li>
                ))}
              </ul>
            </div>

            <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 font-mono text-[11px] text-slate-700 dark:text-slate-300">
              <code>Optimization Engine Log: Target room {currentCase.recommendedCandidate} selected with score 94.2/100 (Variance 0.02).</code>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Optimizer;
