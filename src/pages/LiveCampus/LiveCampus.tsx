import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Radio,
  Building,
  Layers,
  Clock,
  Users,
  ShieldCheck,
  DoorOpen,
  Eye,
  Wrench,
  AlertTriangle,
  RefreshCw,
  LayoutGrid,
  Map,
  List,
  Play,
  Pause,
  Activity,
  Zap,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Modal } from '@/components/ui/Modal';
import { LiveVideoPlayer } from '@/components/shared/LiveVideoPlayer';

export type LiveStatusType =
  | 'Available'
  | 'Occupied'
  | 'Underutilized'
  | 'Overcrowded'
  | 'Maintenance';

interface LiveRoomResource {
  id: string;
  code: string; // e.g. A101, A102, B201, B202, C101
  name: string;
  building: string;
  floor: number;
  capacity: number;
  currentStudents: number;
  status: LiveStatusType;
  currentCourse?: string;
  faculty?: string;
  timeRemaining?: number; // minutes
}

const INITIAL_LIVE_ROOMS: LiveRoomResource[] = [
  { id: 'LR1', code: 'A101', name: 'Room A101', building: 'Block A', floor: 1, capacity: 60, currentStudents: 0, status: 'Available' },
  { id: 'LR2', code: 'A102', name: 'Room A102', building: 'Block A', floor: 1, capacity: 60, currentStudents: 52, status: 'Occupied', currentCourse: 'Data Structures (CS201)', faculty: 'Dr. Rajesh Kumar', timeRemaining: 24 },
  { id: 'LR3', code: 'B201', name: 'Room B201', building: 'Block B', floor: 2, capacity: 80, currentStudents: 14, status: 'Underutilized', currentCourse: 'Elective Seminar', faculty: 'Prof. Suresh Nair', timeRemaining: 42 },
  { id: 'LR4', code: 'B202', name: 'Room B202', building: 'Block B', floor: 2, capacity: 40, currentStudents: 65, status: 'Overcrowded', currentCourse: 'DBMS Lab (CS351)', faculty: 'Dr. Priya Mehta', timeRemaining: 38 },
  { id: 'LR5', code: 'C101', name: 'Room C101', building: 'Block C', floor: 1, capacity: 50, currentStudents: 0, status: 'Maintenance' },
  { id: 'LR6', code: 'A103', name: 'Room A103', building: 'Block A', floor: 1, capacity: 60, currentStudents: 48, status: 'Occupied', currentCourse: 'Algorithms (CS202)', faculty: 'Prof. Anita Sharma', timeRemaining: 18 },
  { id: 'LR7', code: 'A201', name: 'CS Lab 1', building: 'Block A', floor: 2, capacity: 40, currentStudents: 38, status: 'Occupied', currentCourse: 'Programming Lab', faculty: 'Dr. Dinesh Patel', timeRemaining: 55 },
  { id: 'LR8', code: 'B101', name: 'Physics Lab', building: 'Block B', floor: 1, capacity: 35, currentStudents: 0, status: 'Available' },
  { id: 'LR9', code: 'B102', name: 'Chemistry Lab', building: 'Block B', floor: 1, capacity: 30, currentStudents: 26, status: 'Occupied', currentCourse: 'Organic Chem', faculty: 'Dr. Lakshmi Venkat', timeRemaining: 12 },
  { id: 'LR10', code: 'C201', name: 'Room C201', building: 'Block C', floor: 2, capacity: 45, currentStudents: 8, status: 'Underutilized', currentCourse: 'Study Hour', timeRemaining: 30 },
  { id: 'LR11', code: 'D101', name: 'Auditorium D1', building: 'Block D', floor: 1, capacity: 120, currentStudents: 110, status: 'Occupied', currentCourse: 'Physics Lecture', faculty: 'Dr. Mohan Rao', timeRemaining: 45 },
  { id: 'LR12', code: 'E101', name: 'Room E101', building: 'Block E', floor: 1, capacity: 50, currentStudents: 0, status: 'Maintenance' },
];

export const LiveCampus = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<LiveRoomResource[]>(INITIAL_LIVE_ROOMS);
  const [viewMode, setViewMode] = useState<'cards' | 'map' | 'list'>('cards');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [buildingFilter, setBuildingFilter] = useState<string>('all');
  const [isLiveActive, setIsLiveActive] = useState<boolean>(true);
  const [lastTick, setLastTick] = useState<Date>(new Date());
  const [sensorEventLog, setSensorEventLog] = useState<string[]>([
    '09:42:15 - Sensor A102: Student entry detected (+2)',
    '09:42:10 - Sensor B202: Overcrowded threshold exceeded (65/40)',
    '09:41:50 - Sensor C101: HVAC Maintenance mode engaged',
  ]);
  const [cctvRoom, setCctvRoom] = useState<LiveRoomResource | null>(null);

  // Simulated live telemetry updates every 4 seconds
  useEffect(() => {
    if (!isLiveActive) return;

    const interval = setInterval(() => {
      setLastTick(new Date());
      setRooms((prev) =>
        prev.map((room) => {
          if (room.status === 'Occupied' || room.status === 'Overcrowded' || room.status === 'Underutilized') {
            const newTime = Math.max((room.timeRemaining || 10) - 1, 1);
            return {
              ...room,
              timeRemaining: newTime,
            };
          }
          return room;
        })
      );

      // Random telemetry log
      const sampleEvents = [
        'A102: Door sensor telemetry heartbeat received',
        'B201: Low occupancy confirmed by PIR sensors',
        'B202: Overcrowding alert active - 65 attendees',
        'A101: Room vacant - Ventilation operating in eco mode',
        'D101: Auditorium acoustics and AV online',
      ];
      const randomEvent = sampleEvents[Math.floor(Math.random() * sampleEvents.length)];
      setSensorEventLog((prev) => [
        `${new Date().toLocaleTimeString()} - Sensor ${randomEvent}`,
        ...prev.slice(0, 4),
      ]);
    }, 4000);

    return () => clearInterval(interval);
  }, [isLiveActive]);

  // Status Counts (Section 16 Requirements)
  const totalCount = rooms.length;
  const availableCount = rooms.filter((r) => r.status === 'Available').length;
  const occupiedCount = rooms.filter((r) => r.status === 'Occupied').length;
  const maintenanceCount = rooms.filter((r) => r.status === 'Maintenance').length;
  const underutilizedCount = rooms.filter((r) => r.status === 'Underutilized').length;
  const overcrowdedCount = rooms.filter((r) => r.status === 'Overcrowded').length;

  const filteredRooms = rooms.filter((r) => {
    const matchStatus = statusFilter === 'all' || r.status === statusFilter;
    const matchBuilding = buildingFilter === 'all' || r.building === buildingFilter;
    return matchStatus && matchBuilding;
  });

  const getStatusBadge = (status: LiveStatusType) => {
    switch (status) {
      case 'Available':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Available
          </span>
        );
      case 'Occupied':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            Occupied
          </span>
        );
      case 'Underutilized':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            Underutilized
          </span>
        );
      case 'Overcrowded':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-orange-50 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300 border border-orange-300 dark:border-orange-800 animate-pulse">
            <AlertTriangle className="w-3 h-3 text-orange-600" />
            Overcrowded
          </span>
        );
      case 'Maintenance':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300 border border-red-200 dark:border-red-800">
            <Wrench className="w-3 h-3 text-red-600" />
            Maintenance
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 dark:from-emerald-400 dark:via-teal-300 dark:to-cyan-300 bg-clip-text text-transparent">
              Live Campus Resource Monitor
            </h1>
            <Badge variant="success" dot className="animate-pulse">
              SIMULATED TELEMETRY ACTIVE
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 mt-1 font-medium">
            Real-time IoT occupancy stream monitoring campus spaces, seat capacity, and live status.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsLiveActive(!isLiveActive)}
            icon={isLiveActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          >
            {isLiveActive ? 'Pause Stream' : 'Resume Live'}
          </Button>

          {/* View Mode Switcher */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                viewMode === 'cards'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
              title="Card View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                viewMode === 'map'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
              title="Floorplan Map View"
            >
              <Map className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 16. STATUS METRICS CARDS: Total, Available, Occupied, Maintenance, Underutilized, Overcrowded */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* Total */}
        <Card
          padding="sm"
          hoverEffect
          onClick={() => setStatusFilter('all')}
          className={`cursor-pointer ${statusFilter === 'all' ? 'ring-2 ring-blue-500' : ''}`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase">Total Rooms</span>
            <DoorOpen className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">
            {totalCount}
          </p>
        </Card>

        {/* Available */}
        <Card
          padding="sm"
          hoverEffect
          onClick={() => setStatusFilter('Available')}
          className={`bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900 cursor-pointer ${
            statusFilter === 'Available' ? 'ring-2 ring-emerald-500' : ''
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 uppercase">Available</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>
          <p className="text-2xl font-extrabold text-emerald-900 dark:text-emerald-100 mt-1">
            {availableCount}
          </p>
        </Card>

        {/* Occupied */}
        <Card
          padding="sm"
          hoverEffect
          onClick={() => setStatusFilter('Occupied')}
          className={`bg-blue-50/40 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900 cursor-pointer ${
            statusFilter === 'Occupied' ? 'ring-2 ring-blue-500' : ''
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-blue-800 dark:text-blue-300 uppercase">Occupied</span>
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          </div>
          <p className="text-2xl font-extrabold text-blue-900 dark:text-blue-100 mt-1">
            {occupiedCount}
          </p>
        </Card>

        {/* Maintenance */}
        <Card
          padding="sm"
          hoverEffect
          onClick={() => setStatusFilter('Maintenance')}
          className={`bg-red-50/40 dark:bg-red-950/20 border-red-200 dark:border-red-900 cursor-pointer ${
            statusFilter === 'Maintenance' ? 'ring-2 ring-red-500' : ''
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-red-800 dark:text-red-300 uppercase">Maintenance</span>
            <Wrench className="w-3.5 h-3.5 text-red-500" />
          </div>
          <p className="text-2xl font-extrabold text-red-900 dark:text-red-100 mt-1">
            {maintenanceCount}
          </p>
        </Card>

        {/* Underutilized */}
        <Card
          padding="sm"
          hoverEffect
          onClick={() => setStatusFilter('Underutilized')}
          className={`bg-slate-100/60 dark:bg-slate-800/40 border-slate-300 dark:border-slate-700 cursor-pointer ${
            statusFilter === 'Underutilized' ? 'ring-2 ring-slate-500' : ''
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase">Underutilized</span>
            <span className="w-2 h-2 rounded-full bg-slate-400" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">
            {underutilizedCount}
          </p>
        </Card>

        {/* Overcrowded */}
        <Card
          padding="sm"
          hoverEffect
          onClick={() => setStatusFilter('Overcrowded')}
          className={`bg-orange-50/40 dark:bg-orange-950/20 border-orange-300 dark:border-orange-900 cursor-pointer ${
            statusFilter === 'Overcrowded' ? 'ring-2 ring-orange-500' : ''
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-orange-800 dark:text-orange-300 uppercase">Overcrowded</span>
            <AlertTriangle className="w-3.5 h-3.5 text-orange-500" />
          </div>
          <p className="text-2xl font-extrabold text-orange-900 dark:text-orange-100 mt-1">
            {overcrowdedCount}
          </p>
        </Card>
      </div>

      {/* Building Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 mr-1.5 flex items-center gap-1">
          <Building className="w-3.5 h-3.5" />
          Building Wing:
        </span>
        {['all', 'Block A', 'Block B', 'Block C', 'Block D', 'Block E'].map((b) => (
          <button
            key={b}
            onClick={() => setBuildingFilter(b)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              buildingFilter === b
                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                : 'bg-slate-200/80 dark:bg-slate-800 text-slate-900 dark:text-slate-100 hover:bg-slate-300 dark:hover:bg-slate-700 border border-slate-300/60 dark:border-slate-700'
            }`}
          >
            {b === 'all' ? 'All Blocks' : b}
          </button>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* 16. VIEW MODES: CARDS / MAP / LIST */}
      {/* ========================================================================= */}

      {/* 1. CARDS VIEW */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredRooms.map((room) => {
            const occupancyPct = Math.round((room.currentStudents / room.capacity) * 100);

            return (
              <Card
                key={room.id}
                padding="md"
                hoverEffect
                onClick={() => navigate(`/rooms/R001`)}
                className={`flex flex-col justify-between space-y-3 border-2 transition-all ${
                  room.status === 'Occupied'
                    ? 'border-blue-400 dark:border-blue-800 bg-blue-50/15'
                    : room.status === 'Available'
                    ? 'border-emerald-400 dark:border-emerald-900 bg-emerald-50/15'
                    : room.status === 'Overcrowded'
                    ? 'border-orange-400 dark:border-orange-800 bg-orange-50/20'
                    : room.status === 'Underutilized'
                    ? 'border-slate-300 dark:border-slate-700 bg-slate-50/40'
                    : 'border-red-400 dark:border-red-900 bg-red-50/15'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-1">
                    <div>
                      <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300">
                        {room.building} • Fl {room.floor}
                      </span>
                      <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
                        {room.code}
                      </h3>
                      <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">{room.name}</p>
                    </div>
                    {getStatusBadge(room.status)}
                  </div>

                  {room.currentCourse && (
                    <div className="p-2.5 rounded-lg bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-1 text-xs">
                      <p className="font-bold text-slate-900 dark:text-slate-100 truncate">
                        {room.currentCourse}
                      </p>
                      <p className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate">{room.faculty}</p>
                      <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-200 dark:border-slate-800 font-mono">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {room.currentStudents} / {room.capacity} seats ({occupancyPct}%)
                        </span>
                        {room.timeRemaining && (
                          <span className="text-blue-600 dark:text-blue-400 font-bold flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {room.timeRemaining}m left
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {room.status === 'Available' && (
                    <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-xs text-emerald-800 dark:text-emerald-300">
                      <p className="font-semibold">Ready for Allocation</p>
                      <p className="text-[11px] text-emerald-600">Capacity: {room.capacity} seats</p>
                    </div>
                  )}

                  {room.status === 'Maintenance' && (
                    <div className="p-2.5 rounded-lg bg-red-50 dark:bg-red-950/40 text-xs text-red-800 dark:text-red-300">
                      <p className="font-semibold">Facility Offline</p>
                      <p className="text-[11px] text-red-600">HVAC overhaul scheduled</p>
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-800 dark:text-slate-200 font-semibold">
                  <span>Capacity: {room.capacity}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCctvRoom(room)}
                      className="font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" /> Live
                    </button>
                    <span className="font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer" onClick={() => navigate(`/rooms/R001`)}>
                      View Room →
                    </span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* 2. MAP VIEW (Floorplan Blueprint) */}
      {viewMode === 'map' && (
        <Card padding="md" className="space-y-4">
          <CardHeader>
            <div>
              <CardTitle>Campus Blueprint & Floorplan Map</CardTitle>
              <CardDescription>Visual architectural grid indicating live room activity</CardDescription>
            </div>
            <Badge variant="info">Floor 1 Blueprint</Badge>
          </CardHeader>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-900 text-white border border-slate-800">
            {/* Wing 1 */}
            <div className="border border-slate-700 rounded-xl p-3 space-y-3 bg-slate-800/60">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Block A — East Corridor
              </span>
              <div className="grid grid-cols-2 gap-2">
                {rooms.filter((r) => r.building === 'Block A').slice(0, 4).map((r) => (
                  <div
                    key={r.id}
                    className={`p-3 rounded-lg border text-center cursor-pointer ${
                      r.status === 'Occupied'
                        ? 'border-blue-500 bg-blue-950/80 text-blue-200'
                        : r.status === 'Available'
                        ? 'border-emerald-500 bg-emerald-950/80 text-emerald-200'
                        : 'border-red-500 bg-red-950/80 text-red-200'
                    }`}
                  >
                    <p className="font-bold text-sm">{r.code}</p>
                    <span className="text-[10px] font-mono">{r.status}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Wing 2 */}
            <div className="border border-slate-700 rounded-xl p-3 space-y-3 bg-slate-800/60">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Block B — Science Labs Wing
              </span>
              <div className="grid grid-cols-2 gap-2">
                {rooms.filter((r) => r.building === 'Block B').slice(0, 4).map((r) => (
                  <div
                    key={r.id}
                    className={`p-3 rounded-lg border text-center cursor-pointer ${
                      r.status === 'Occupied'
                        ? 'border-blue-500 bg-blue-950/80 text-blue-200'
                        : r.status === 'Overcrowded'
                        ? 'border-orange-500 bg-orange-950/80 text-orange-200'
                        : 'border-emerald-500 bg-emerald-950/80 text-emerald-200'
                    }`}
                  >
                    <p className="font-bold text-sm">{r.code}</p>
                    <span className="text-[10px] font-mono">{r.status}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Wing 3 */}
            <div className="border border-slate-700 rounded-xl p-3 space-y-3 bg-slate-800/60">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Block C & D — Auditoriums
              </span>
              <div className="grid grid-cols-2 gap-2">
                {rooms.filter((r) => r.building === 'Block C' || r.building === 'Block D').slice(0, 4).map((r) => (
                  <div
                    key={r.id}
                    className={`p-3 rounded-lg border text-center cursor-pointer ${
                      r.status === 'Maintenance'
                        ? 'border-red-500 bg-red-950/80 text-red-200'
                        : r.status === 'Occupied'
                        ? 'border-blue-500 bg-blue-950/80 text-blue-200'
                        : 'border-slate-600 bg-slate-800 text-slate-300'
                    }`}
                  >
                    <p className="font-bold text-sm">{r.code}</p>
                    <span className="text-[10px] font-mono">{r.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* 3. LIST VIEW */}
      {viewMode === 'list' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-100 dark:bg-slate-800 border-b-2 border-slate-300 dark:border-slate-600 font-bold uppercase tracking-widest text-[11px]">
                <tr>
                  <th className="px-4 py-3.5 text-blue-700 dark:text-cyan-300 min-w-[180px] w-[22%]">Room Code & Name</th>
                  <th className="px-4 py-3.5 text-indigo-700 dark:text-indigo-300 whitespace-nowrap min-w-[130px] w-[14%]">Building & Floor</th>
                  <th className="px-4 py-3.5 text-violet-700 dark:text-violet-300 whitespace-nowrap min-w-[110px] w-[10%]">Capacity</th>
                  <th className="px-4 py-3.5 text-emerald-700 dark:text-emerald-300 whitespace-nowrap min-w-[110px] w-[11%]">Live Status</th>
                  <th className="px-4 py-3.5 text-sky-700 dark:text-sky-300 min-w-[200px] w-[25%]">Current Active Course</th>
                  <th className="px-4 py-3.5 text-amber-700 dark:text-amber-300 whitespace-nowrap min-w-[110px] w-[10%]">Time Left</th>
                  <th className="px-4 py-3.5 text-right text-slate-700 dark:text-slate-200 whitespace-nowrap min-w-[100px] w-[8%]">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredRooms.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                    <td className="px-4 py-3 font-bold font-mono text-slate-900 dark:text-slate-100 align-middle whitespace-nowrap">
                      {r.code} - {r.name}
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-700 dark:text-slate-300 align-middle whitespace-nowrap">
                      {r.building}, Fl {r.floor}
                    </td>
                    <td className="px-4 py-3 font-bold text-slate-900 dark:text-slate-100 align-middle whitespace-nowrap">
                      {r.capacity} seats
                    </td>
                    <td className="px-4 py-3 align-middle whitespace-nowrap">
                      {getStatusBadge(r.status)}
                    </td>
                    <td className="px-4 py-3 text-blue-700 dark:text-cyan-300 font-semibold align-middle">
                      {r.currentCourse || '— Vacant —'}
                    </td>
                    <td className="px-4 py-3 font-mono font-semibold text-amber-600 dark:text-amber-300 align-middle whitespace-nowrap">
                      {r.timeRemaining ? `${r.timeRemaining} mins` : '—'}
                    </td>
                    <td className="px-4 py-3 text-right align-middle whitespace-nowrap">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="sm" onClick={() => setCctvRoom(r)} title="Live CCTV">
                          <Eye className="w-4 h-4 text-emerald-600" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => navigate('/rooms/R001')}>
                          View
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Live Telemetry Sensor Stream Log */}
      <Card padding="md" className="space-y-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-600 dark:text-emerald-400 animate-pulse" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
              Live IoT Sensor Telemetry Stream
            </h3>
          </div>
          <span className="text-[11px] font-mono font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
            Auto-ticks every 4s • Active
          </span>
        </div>

        <div className="space-y-1.5 font-mono text-xs bg-slate-50 dark:bg-slate-950/60 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800/80">
          {sensorEventLog.map((log, idx) => {
            const parts = log.split(' - ');
            const timePart = parts[0] || '';
            const rest = parts.slice(1).join(' - ');
            const colonIndex = rest.indexOf(':');
            const sensorPart = colonIndex !== -1 ? rest.substring(0, colonIndex + 1) : '';
            const msgPart = colonIndex !== -1 ? rest.substring(colonIndex + 1) : rest;

            return (
              <p key={idx} className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold shrink-0">▸</span>
                <span className="text-blue-700 dark:text-cyan-300 font-bold shrink-0">{timePart}</span>
                <span className="text-slate-400 dark:text-slate-600 shrink-0">-</span>
                {sensorPart && (
                  <span className="text-indigo-700 dark:text-indigo-300 font-bold shrink-0">{sensorPart}</span>
                )}
                <span className="text-slate-900 dark:text-slate-100 font-semibold">{msgPart}</span>
              </p>
            );
          })}
        </div>
      </Card>

      {/* CCTV Modal */}
      {cctvRoom && (
        <Modal
          open={!!cctvRoom}
          onClose={() => setCctvRoom(null)}
          title={`Live Camera Feed: ${cctvRoom.code}`}
          description={cctvRoom.name}
          size="lg"
        >
          <div className="mt-2 mb-4">
            <LiveVideoPlayer
              roomId={cctvRoom.code}
              roomName={cctvRoom.name}
              capacity={cctvRoom.capacity}
              currentStudents={cctvRoom.currentStudents}
            />
          </div>
          <div className="flex justify-end">
            <Button variant="secondary" onClick={() => setCctvRoom(null)}>
              Close Feed
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default LiveCampus;
