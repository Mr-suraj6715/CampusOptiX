import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertOctagon,
  Wrench,
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldAlert,
  Users,
  DoorOpen,
  Send,
  RefreshCw,
  Zap,
  Flame,
  Radio,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';

interface EmergencyIncident {
  id: string;
  room: string;
  building: string;
  reason: string;
  status: 'Emergency' | 'Critical' | 'Resolved';
  reportedAt: string;
  affectedClassesCount: number;
  affectedClasses: {
    code: string;
    name: string;
    faculty: string;
    students: number;
    time: string;
    currentRoom: string;
    alternativeRoom: string;
    altCapacity: number;
    matchScore: number;
    resolved: boolean;
  }[];
}

const INITIAL_INCIDENT: EmergencyIncident = {
  id: 'EMG-2026-08',
  room: 'Lab B204',
  building: 'Block B',
  reason: 'Electrical short circuit & HVAC failure in server cooling rack',
  status: 'Emergency',
  reportedAt: '10 mins ago',
  affectedClassesCount: 3,
  affectedClasses: [
    {
      code: 'CS351',
      name: 'Database Management Systems Lab',
      faculty: 'Dr. Priya Mehta',
      students: 65,
      time: '02:00 PM - 04:00 PM',
      currentRoom: 'Lab B204',
      alternativeRoom: 'Lab A (Block A, Floor 1)',
      altCapacity: 80,
      matchScore: 96,
      resolved: false,
    },
    {
      code: 'CS201',
      name: 'Data Structures Lab Session',
      faculty: 'Dr. Rajesh Kumar',
      students: 53,
      time: '11:00 AM - 01:00 PM',
      currentRoom: 'Lab B204',
      alternativeRoom: 'CS Lab 1 (Block A, Floor 0)',
      altCapacity: 40,
      matchScore: 84,
      resolved: false,
    },
    {
      code: 'CS450',
      name: 'Machine Learning Lab',
      faculty: 'Prof. Anita Sharma',
      students: 48,
      time: '09:00 AM - 11:00 AM',
      currentRoom: 'Lab B204',
      alternativeRoom: 'Lab C (Block C, Floor 2)',
      altCapacity: 70,
      matchScore: 88,
      resolved: false,
    },
  ],
};

export const EmergencyReallocation = () => {
  const navigate = useNavigate();
  const [incident, setIncident] = useState<EmergencyIncident>(INITIAL_INCIDENT);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isDeployModalOpen, setIsDeployModalOpen] = useState<boolean>(false);

  const handleSimulateSearch = () => {
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      setToastMessage('Optimal alternative venues identified with 94% safety buffer.');
      setTimeout(() => setToastMessage(null), 3500);
    }, 1500);
  };

  const handleDeployAll = () => {
    setIsDeployModalOpen(true);
  };

  const handleConfirmDeploy = () => {
    setIncident((prev) => ({
      ...prev,
      status: 'Resolved',
      affectedClasses: prev.affectedClasses.map((c) => ({ ...c, resolved: true })),
    }));
    setIsDeployModalOpen(false);
    setToastMessage('Emergency reallocation deployed! Broadcast alerts dispatched to 166 students & 3 faculty members.');
    setTimeout(() => setToastMessage(null), 4500);
  };

  const getStatusBadge = (status: EmergencyIncident['status']) => {
    switch (status) {
      case 'Emergency':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-red-600 text-white animate-pulse shadow-md">
            <Flame className="w-3.5 h-3.5 fill-white" />
            EMERGENCY
          </span>
        );
      case 'Critical':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-orange-500 text-white">
            <AlertOctagon className="w-3.5 h-3.5" />
            CRITICAL
          </span>
        );
      case 'Resolved':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white">
            <CheckCircle2 className="w-3.5 h-3.5" />
            RESOLVED
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl border border-slate-700 flex items-center gap-3 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <p className="text-xs sm:text-sm font-medium">{toastMessage}</p>
        </div>
      )}

      {/* Emergency Header Card */}
      <Card padding="lg" className="border-l-8 border-l-red-600 bg-red-50/20 dark:bg-red-950/20">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              {getStatusBadge(incident.status)}
              <span className="font-mono text-xs text-slate-700 dark:text-slate-300 font-bold">{incident.id}</span>
              <span className="text-xs text-slate-700 dark:text-slate-300">• Reported {incident.reportedAt}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
              "{incident.room} has become unavailable."
            </h1>

            <p className="text-xs sm:text-sm text-red-700 dark:text-red-300 font-medium">
              Incident Cause: {incident.reason}
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <Button
              variant="secondary"
              size="md"
              onClick={handleSimulateSearch}
              loading={isSearching}
              icon={<RefreshCw className="w-4 h-4" />}
            >
              Re-Scan Alternatives
            </Button>
            <Button
              variant="danger"
              size="md"
              onClick={handleDeployAll}
              disabled={incident.status === 'Resolved'}
              icon={<Zap className="w-4 h-4" />}
            >
              {incident.status === 'Resolved' ? 'Reallocation Deployed' : 'Deploy Emergency Plan'}
            </Button>
          </div>
        </div>
      </Card>

      {/* Key Metric Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">Affected Cohorts</span>
          <p className="text-2xl font-extrabold text-red-600 dark:text-red-400">
            {incident.affectedClassesCount} Classes Disrupted
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">Affected Students</span>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
            166 Students Total
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">Auto-Resolved State</span>
          <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
            {incident.status === 'Resolved' ? '3 of 3 Reallocated' : 'Ready for Instant Dispatch'}
          </p>
        </div>
      </div>

      {/* System Searching State Simulation Banner */}
      {isSearching && (
        <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center gap-3 animate-pulse">
          <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />
          <div>
            <h4 className="text-sm font-bold text-blue-900 dark:text-blue-200">
              System is searching for alternatives...
            </h4>
            <p className="text-xs text-blue-700 dark:text-blue-300">
              Querying live IoT capacity and timetable collisions across Block A through Block H.
            </p>
          </div>
        </div>
      )}

      {/* Recommended Alternatives List (Section 18 Requirements) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600" />
            Recommended Immediate Alternatives
          </h2>
          <span className="text-xs text-slate-400">Ranked by minimum travel distance & capacity</span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {incident.affectedClasses.map((cls, idx) => (
            <Card
              key={idx}
              padding="md"
              className={`border-l-4 transition-all ${
                cls.resolved ? 'border-l-emerald-500 bg-emerald-50/10' : 'border-l-orange-500'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                      {cls.code}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                      {cls.name}
                    </h3>
                    <span className="text-xs text-slate-400 font-mono">({cls.time})</span>
                    {cls.resolved ? (
                      <Badge variant="success">Reassigned</Badge>
                    ) : (
                      <Badge variant="orange">Pending Move</Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-6 text-xs text-slate-600 dark:text-slate-400 flex-wrap">
                    <span className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      Cohort: <strong>{cls.students} Students</strong>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <DoorOpen className="w-3.5 h-3.5 text-slate-400" />
                      Original Room: <strong className="text-red-500 line-through">{cls.currentRoom}</strong>
                    </span>
                    <span>Instructor: <strong>{cls.faculty}</strong></span>
                  </div>

                  {/* Alternative Room Target */}
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <ArrowRight className="w-4 h-4 text-blue-600 shrink-0" />
                      <div>
                        <span className="text-[10px] uppercase font-semibold text-slate-400">
                          Recommended Substitute Venue:
                        </span>
                        <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
                          {cls.alternativeRoom} (Capacity: {cls.altCapacity} seats)
                        </p>
                      </div>
                    </div>

                    <span className="font-mono font-bold text-xs bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 px-2.5 py-1 rounded-md border border-emerald-200 dark:border-emerald-800">
                      Score: {cls.matchScore}/100
                    </span>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <Button
                    variant={cls.resolved ? 'secondary' : 'primary'}
                    size="sm"
                    onClick={() => {
                      setIncident((prev) => ({
                        ...prev,
                        affectedClasses: prev.affectedClasses.map((item, i) =>
                          i === idx ? { ...item, resolved: true } : item
                        ),
                      }));
                      setToastMessage(`Class ${cls.code} relocated to ${cls.alternativeRoom}.`);
                      setTimeout(() => setToastMessage(null), 3000);
                    }}
                  >
                    {cls.resolved ? 'Relocation Confirmed' : 'Reallocate Class'}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Deploy Modal */}
      {isDeployModalOpen && (
        <Modal
          open={isDeployModalOpen}
          onClose={() => setIsDeployModalOpen(false)}
          title="Deploy Campus Emergency Plan"
          description="Instant multi-class reallocation and student SMS broadcasting."
          size="md"
          footer={
            <>
              <Button variant="secondary" size="sm" onClick={() => setIsDeployModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="danger" size="sm" onClick={handleConfirmDeploy} icon={<Send className="w-3.5 h-3.5" />}>
                Confirm & Broadcast Alerts
              </Button>
            </>
          }
        >
          <div className="space-y-4 text-xs">
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Confirming this emergency action will immediately lock <strong>{incident.room}</strong> under Maintenance mode and dispatch timetable push updates to all 166 enrolled students.
            </p>

            <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 space-y-1.5">
              <span className="font-bold text-red-900 dark:text-red-200 uppercase text-[11px]">
                Emergency Channels Dispatched:
              </span>
              <ul className="list-disc pl-5 space-y-1 text-red-800 dark:text-red-300">
                <li>Campus Digital Noticeboards (Building B & A entryways)</li>
                <li>Student Companion App push notification</li>
                <li>Instructor SMS priority dispatch</li>
              </ul>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default EmergencyReallocation;
