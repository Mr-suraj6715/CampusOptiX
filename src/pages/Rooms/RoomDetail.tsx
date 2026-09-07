import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Building,
  Users,
  Layers,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Wrench,
  Calendar,
  Clock,
  Sparkles,
  ShieldCheck,
  Zap,
  Radio,
  Edit,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Modal } from '@/components/ui/Modal';
import { RoomStatusBadge } from '@/components/shared/StatusBadge';
import { LiveVideoPlayer } from '@/components/shared/LiveVideoPlayer';
import { mockRooms, mockDetailedConflicts } from '@/data/mockData';
import type { RoomStatus } from '@/types';
import { formatPercent, getUtilizationColor } from '@/utils/cn';
import { useAuth } from '@/context/AuthContext';

export const RoomDetail = () => {
  const { user } = useAuth();
  const isStudent = user?.role === 'STUDENT';
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Find room from mockRooms or default to first
  const initialRoom = mockRooms.find((r) => r.id === id) || mockRooms[0];
  const [room, setRoom] = useState(initialRoom);

  // Emergency Change / Status Override Modal
  const [isOverrideModalOpen, setIsOverrideModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<RoomStatus>(room.status);
  const [overrideReason, setOverrideReason] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const activeConflictsForRoom = mockDetailedConflicts.filter(
    (c) => (c.room.includes(room.name) || c.room.includes(room.id)) && c.status === 'open'
  );

  const handleStatusOverride = (e: React.FormEvent) => {
    e.preventDefault();
    setRoom((prev) => ({
      ...prev,
      status: selectedStatus,
    }));
    setIsOverrideModalOpen(false);
    setToastMessage(`Room status updated to ${selectedStatus.toUpperCase()}. System notifications dispatched.`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl border border-slate-700 flex items-center gap-3 animate-in fade-in duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <p className="text-xs sm:text-sm font-medium">{toastMessage}</p>
        </div>
      )}

      {/* Back button & Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/rooms')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Rooms Directory</span>
        </button>

        {!isStudent && (
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsOverrideModalOpen(true)}
              icon={<Wrench className="w-3.5 h-3.5" />}
            >
              Emergency Status Override
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate(`/optimizer?roomId=${room.id}`)}
              icon={<Sparkles className="w-3.5 h-3.5" />}
            >
              Optimize Room
            </Button>
          </div>
        )}
      </div>

      {/* Main Room Hero Card */}
      <Card padding="lg" className="border-t-4 border-t-blue-600">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                {room.id}
              </span>
              <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 dark:from-cyan-300 dark:via-blue-300 dark:to-indigo-300 bg-clip-text text-transparent">
                {room.name}
              </h1>
              <RoomStatusBadge status={room.status} />
              <Badge variant="slate" className="capitalize">
                {room.type.replace('-', ' ')}
              </Badge>
            </div>

            <div className="flex items-center gap-6 text-xs sm:text-sm text-slate-800 dark:text-slate-100 flex-wrap">
              <span className="flex items-center gap-1.5 font-semibold">
                <Building className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                {room.building} (Floor {room.floor})
              </span>
              <span className="flex items-center gap-1.5 font-semibold">
                <Users className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                Capacity: <strong className="text-slate-950 dark:text-white">{room.capacity} Students</strong>
              </span>
              <span className="flex items-center gap-1.5 font-semibold">
                <Activity className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                Utilization: <strong className={getUtilizationColor(room.utilization)}>{formatPercent(room.utilization)}</strong>
              </span>
            </div>

            {/* Amenities Tags */}
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              {room.amenities.map((item, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-200/80 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-300/50 dark:border-slate-700"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Quick Utilization Gauge */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 min-w-[240px] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800 dark:text-slate-200">Space Utilization</span>
              <span className={`font-bold ${getUtilizationColor(room.utilization)}`}>
                {formatPercent(room.utilization)}
              </span>
            </div>
            <ProgressBar value={room.utilization} size="md" />
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              {room.utilization >= 85
                ? 'High load • Approaching maximum capacity'
                : room.utilization < 40
                ? 'Underutilized • Candidate for schedule consolidation'
                : 'Optimal utilization zone'}
            </p>
          </div>
        </div>
      </Card>

      {/* Active Conflict Warning if any */}
      {activeConflictsForRoom.length > 0 && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 flex items-start gap-3.5 animate-in fade-in">
          <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
          <div className="flex-1 space-y-1">
            <h4 className="text-sm font-semibold text-red-900 dark:text-red-200">
              Active Conflict: {activeConflictsForRoom[0].course}
            </h4>
            <p className="text-xs text-red-800 dark:text-red-300">
              {activeConflictsForRoom[0].problem}
            </p>
            <p className="text-xs font-semibold text-red-900 dark:text-red-200 pt-1">
              AI Recommendation: {activeConflictsForRoom[0].recommendedAction}
            </p>
          </div>
          <Button
            variant="danger"
            size="sm"
            onClick={() => navigate('/conflicts')}
          >
            Resolve Conflict
          </Button>
        </div>
      )}

      {/* Grid: Current Activity + Equipment List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Activity Card */}
        <Card padding="md" className="space-y-4">
          <CardHeader>
            <div>
              <CardTitle>Current Session</CardTitle>
              <CardDescription>Live session status in progress</CardDescription>
            </div>
            <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              Live
            </span>
          </CardHeader>

          {room.currentClass ? (
            <div className="p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900 space-y-3">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  Course In Session
                </span>
                <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  {room.currentClass}
                </h4>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                <p>
                  <strong>Instructor:</strong> {room.currentFaculty || 'Faculty In-Charge'}
                </p>
                <p>
                  <strong>Time Window:</strong> 09:00 AM - 10:30 AM
                </p>
                <p>
                  <strong>Attendance:</strong> 53 / {room.capacity} seated (88%)
                </p>
              </div>

              <div className="pt-2 border-t border-blue-200/60 dark:border-blue-800 flex items-center justify-between text-xs">
                <span className="text-blue-700 dark:text-blue-300 font-medium">
                  Next Class: 11:00 AM
                </span>
                <button
                  onClick={() => navigate('/timetable')}
                  className="font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  View Schedule →
                </button>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800/80 rounded-xl space-y-2 border border-slate-200 dark:border-slate-700">
              <Clock className="w-8 h-8 mx-auto text-slate-600 dark:text-slate-300" />
              <p className="text-xs font-bold text-slate-900 dark:text-white">Room currently vacant</p>
              <p className="text-xs font-medium text-slate-700 dark:text-slate-200">Next scheduled slot is at 02:00 PM</p>
            </div>
          )}
        </Card>

        {/* Equipment & Health Card (2 spans) */}
        <Card className="lg:col-span-2" padding="md">
          <CardHeader>
            <div>
              <CardTitle>Installed Equipment & Health</CardTitle>
              <CardDescription>Hardware inventory and maintenance status</CardDescription>
            </div>
            <Button
              variant="secondary"
              size="sm"
              icon={<Wrench className="w-3.5 h-3.5" />}
            >
              Report Fault
            </Button>
          </CardHeader>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {room.equipment.map((eq) => (
              <div
                key={eq.id}
                className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between gap-3"
              >
                <div className="space-y-0.5">
                  <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                    {eq.name}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Quantity: <strong>{eq.count} units</strong>
                  </p>
                </div>
                <Badge
                  variant={
                    eq.status === 'working'
                      ? 'success'
                      : eq.status === 'faulty'
                      ? 'error'
                      : 'warning'
                  }
                  dot
                >
                  {eq.status.toUpperCase()}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Live CCTV Feed Card */}
      <Card padding="md" className="space-y-4 border border-slate-200 dark:border-slate-800">
        <CardHeader>
          <div>
            <CardTitle>Live Surveillance Feed</CardTitle>
            <CardDescription>Real-time visual monitoring for space utilization and security</CardDescription>
          </div>
          <Badge variant="success" dot className="animate-pulse">
            STREAM ACTIVE
          </Badge>
        </CardHeader>
        <div className="rounded-xl overflow-hidden shadow-sm">
          <LiveVideoPlayer
            roomId={room.id}
            roomName={room.name}
            capacity={room.capacity}
            currentStudents={Math.floor(room.capacity * (room.utilization / 100))}
          />
        </div>
      </Card>

      {/* Weekly Schedule Timeline for this Room */}
      <Card padding="md">
        <CardHeader>
          <div>
            <CardTitle>Weekly Room Schedule</CardTitle>
            <CardDescription>Allocated lecture slots and course sections</CardDescription>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/timetable')}
            icon={<Calendar className="w-3.5 h-3.5" />}
          >
            Full Campus Timetable
          </Button>
        </CardHeader>

        {room.schedule.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-100 dark:bg-slate-800 border-b-2 border-slate-300 dark:border-slate-600 font-bold uppercase tracking-widest text-[11px]">
                <tr>
                  <th className="px-4 py-3 text-blue-700 dark:text-cyan-300">Day</th>
                  <th className="px-4 py-3 text-amber-700 dark:text-amber-300">Time Slot</th>
                  <th className="px-4 py-3 text-indigo-700 dark:text-indigo-300">Course Code</th>
                  <th className="px-4 py-3 text-purple-700 dark:text-purple-300">Course Name</th>
                  <th className="px-4 py-3 text-pink-700 dark:text-pink-300">Faculty</th>
                  <th className="px-4 py-3 text-violet-700 dark:text-violet-300">Cohort</th>
                  <th className="px-4 py-3 text-emerald-700 dark:text-emerald-300">Enrolled</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {room.schedule.map((slot) => (
                  <tr key={slot.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                    <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">
                      {slot.day}
                    </td>
                    <td className="px-4 py-3 font-mono font-semibold text-amber-600 dark:text-amber-300">
                      {slot.startTime} - {slot.endTime}
                    </td>
                    <td className="px-4 py-3 font-mono font-bold text-blue-700 dark:text-cyan-300">
                      {slot.courseCode}
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-900 dark:text-slate-100">
                      {slot.course}
                    </td>
                    <td className="px-4 py-3 font-medium text-pink-700 dark:text-pink-300">
                      {slot.faculty}
                    </td>
                    <td className="px-4 py-3 font-mono font-medium text-violet-700 dark:text-violet-300">Yr {slot.year} • {slot.division}</td>
                    <td className="px-4 py-3">
                      <span className="font-bold text-emerald-700 dark:text-emerald-300">
                        {slot.enrolled} / {room.capacity}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 text-center text-slate-500 bg-slate-50 dark:bg-slate-800/30 rounded-xl">
            <p className="text-xs">No regular timetable entries booked for this room.</p>
          </div>
        )}
      </Card>

      {/* Emergency Status Override Modal */}
      {isOverrideModalOpen && (
        <Modal
          open={isOverrideModalOpen}
          onClose={() => setIsOverrideModalOpen(false)}
          title={`Emergency Status Override: ${room.name}`}
          description="Instantly alter the operational state of this room in case of maintenance, overflow, or drills."
          size="md"
          footer={
            <>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsOverrideModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleStatusOverride}
              >
                Confirm State Change
              </Button>
            </>
          }
        >
          <form onSubmit={handleStatusOverride} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Select New Status
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {(['available', 'occupied', 'reserved', 'maintenance', 'underutilized', 'overcrowded'] as RoomStatus[]).map(
                  (st) => (
                    <button
                      type="button"
                      key={st}
                      onClick={() => setSelectedStatus(st)}
                      className={`p-2.5 rounded-xl border text-xs font-semibold capitalize text-left flex items-center justify-between transition-all ${
                        selectedStatus === st
                          ? 'border-blue-600 bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                          : 'border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span>{st}</span>
                      {selectedStatus === st && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                    </button>
                  )
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Reason / Action Justification
              </label>
              <textarea
                value={overrideReason}
                onChange={(e) => setOverrideReason(e.target.value)}
                placeholder="e.g. Electrical maintenance scheduled due to AC failure..."
                rows={3}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default RoomDetail;
