import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  DoorOpen,
  GraduationCap,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Wifi,
  Wind,
  Zap,
  MapPin,
  User,
  Coffee,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Today's classes for student persona
  const todaysSchedule = [
    {
      id: 's1',
      time: '09:00 - 10:00 AM',
      courseCode: 'CS201',
      subject: 'Data Structures',
      type: 'Lecture',
      faculty: 'Dr. Rajesh Kumar',
      room: 'Room A101',
      roomId: 'R001',
      building: 'Block A, Floor 1',
      status: 'Upcoming',
    },
    {
      id: 's2',
      time: '11:00 - 12:00 PM',
      courseCode: 'CS151',
      subject: 'Programming Lab',
      type: 'Practical',
      faculty: 'Dr. Dinesh Patel',
      room: 'CS Lab 1',
      roomId: 'L001',
      building: 'Block A, Floor 1',
      status: 'Upcoming',
    },
    {
      id: 's3',
      time: '12:00 - 01:00 PM',
      courseCode: 'BREAK',
      subject: 'Campus Lunch Break',
      type: 'Recess',
      faculty: '—',
      room: 'Student Center & Cafeteria',
      roomId: '',
      building: 'Central Campus',
      status: 'Break',
    },
    {
      id: 's4',
      time: '02:00 - 03:00 PM',
      courseCode: 'PH101',
      subject: 'Engineering Physics',
      type: 'Lecture',
      faculty: 'Dr. Mohan Rao',
      room: 'Room D102',
      roomId: 'R004',
      building: 'Block D, Floor 1',
      status: 'Upcoming',
    },
  ];

  // Vacant study spaces right now
  const vacantStudyRooms = [
    {
      id: 'R002',
      name: 'Room B204',
      building: 'Block B, 2nd Floor',
      capacity: 40,
      amenities: ['High-Speed Wi-Fi', 'AC', 'Power Outlets'],
      freeUntil: '01:00 PM',
      recommendedFor: 'Quiet Study',
    },
    {
      id: 'R003',
      name: 'Room C305',
      building: 'Block C, 3rd Floor',
      capacity: 45,
      amenities: ['Wi-Fi', 'Whiteboard', 'Natural Light'],
      freeUntil: '02:30 PM',
      recommendedFor: 'Group Discussion',
    },
    {
      id: 'L003',
      name: 'Multimedia Lab',
      building: 'Block B, Ground Floor',
      capacity: 30,
      amenities: ['PCs', 'High-Speed LAN', 'AC'],
      freeUntil: '03:00 PM',
      recommendedFor: 'Project Work',
    },
  ];

  // Enrolled courses list
  const enrolledCourses = [
    { code: 'CS201', name: 'Data Structures & Algorithms', credits: 4, faculty: 'Dr. Rajesh Kumar', attendance: '92%' },
    { code: 'CS151', name: 'Programming Laboratory', credits: 2, faculty: 'Dr. Dinesh Patel', attendance: '95%' },
    { code: 'CS351', name: 'Database Management Systems Lab', credits: 2, faculty: 'Dr. Priya Mehta', attendance: '85%' },
    { code: 'MA201', name: 'Engineering Mathematics III', credits: 4, faculty: 'Prof. Suresh Nair', attendance: '82%' },
    { code: 'PH101', name: 'Engineering Physics', credits: 3, faculty: 'Dr. Mohan Rao', attendance: '88%' },
  ];

  return (
    <div className="space-y-6">
      {/* Student Welcome Hero */}
      <div
        className="p-6 rounded-2xl relative overflow-hidden transition-all shadow-sm"
        style={{
          backgroundColor: 'var(--surface-1)',
          border: '1px solid var(--border-primary)',
        }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="pill pill-info font-mono text-[10px] uppercase">
                Student Portal
              </span>
              <span className="text-[12px] font-medium" style={{ color: 'var(--text-tertiary)' }}>
                B.Tech Computer Science • Year 3 • Div A
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 dark:from-cyan-300 dark:via-blue-300 dark:to-indigo-300 bg-clip-text text-transparent">
              Welcome back, {user?.name || 'Aryan'} 👋
            </h1>
            <p className="text-[13px] max-w-xl" style={{ color: 'var(--text-secondary)' }}>
              View your personalized timetable, locate your next lecture hall, and find open classrooms for self-study.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate('/rooms')}
              icon={<DoorOpen className="w-4 h-4" />}
            >
              Explore Rooms
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/timetable')}
              icon={<Calendar className="w-4 h-4" />}
            >
              My Timetable →
            </Button>
          </div>
        </div>
      </div>

      {/* Student KPI Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div
          className="p-4 rounded-xl border transition-all"
          style={{ backgroundColor: 'var(--surface-1)', borderColor: 'var(--border-primary)' }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold" style={{ color: 'var(--text-tertiary)' }}>Today's Classes</span>
            <span className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2.5">
            <p className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>3</p>
            <p className="text-xs mt-0.5 text-emerald-600 dark:text-emerald-400 font-medium">
              Next: Data Structures @ 09:00 AM
            </p>
          </div>
        </div>

        <div
          className="p-4 rounded-xl border transition-all"
          style={{ backgroundColor: 'var(--surface-1)', borderColor: 'var(--border-primary)' }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold" style={{ color: 'var(--text-tertiary)' }}>Overall Attendance</span>
            <span className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2.5">
            <p className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>88.4%</p>
            <p className="text-xs mt-0.5 text-emerald-600 dark:text-emerald-400 font-medium">
              ✓ Good Standing (&gt; 75% required)
            </p>
          </div>
        </div>

        <div
          className="p-4 rounded-xl border transition-all"
          style={{ backgroundColor: 'var(--surface-1)', borderColor: 'var(--border-primary)' }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold" style={{ color: 'var(--text-tertiary)' }}>Vacant Study Spaces</span>
            <span className="p-2 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <DoorOpen className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2.5">
            <p className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>6 Rooms</p>
            <p className="text-xs mt-0.5 text-purple-600 dark:text-purple-400 font-medium">
              Available right now on campus
            </p>
          </div>
        </div>

        <div
          className="p-4 rounded-xl border transition-all"
          style={{ backgroundColor: 'var(--surface-1)', borderColor: 'var(--border-primary)' }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold" style={{ color: 'var(--text-tertiary)' }}>Enrolled Courses</span>
            <span className="p-2 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <GraduationCap className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2.5">
            <p className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>5</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
              15 Credits Total
            </p>
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Today's Schedule Timeline */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                Today's Class Schedule
              </h2>
              <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                Your lectures and laboratory sessions for today
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/timetable')}
              icon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              Full Week
            </Button>
          </div>

          <div className="space-y-3">
            {todaysSchedule.map((item) => {
              const isBreak = item.type === 'Recess';
              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isBreak
                      ? 'bg-slate-50/50 dark:bg-slate-900/30 border-dashed border-slate-200 dark:border-slate-800'
                      : 'hover:border-blue-500/40 shadow-2xs'
                  }`}
                  style={{
                    backgroundColor: isBreak ? undefined : 'var(--surface-1)',
                    borderColor: isBreak ? undefined : 'var(--border-primary)',
                  }}
                >
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        isBreak
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400'
                          : item.type === 'Practical'
                          ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400'
                          : 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400'
                      }`}
                    >
                      {isBreak ? (
                        <Coffee className="w-5 h-5" />
                      ) : item.type === 'Practical' ? (
                        <Sparkles className="w-5 h-5" />
                      ) : (
                        <BookOpen className="w-5 h-5" />
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                          {item.subject}
                        </span>
                        {!isBreak && (
                          <span className="font-mono text-[11px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                            {item.courseCode}
                          </span>
                        )}
                        <Badge variant={isBreak ? 'warning' : item.type === 'Practical' ? 'purple' : 'info'}>
                          {item.type}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-4 text-xs flex-wrap" style={{ color: 'var(--text-secondary)' }}>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {item.time}
                        </span>
                        <span className="flex items-center gap-1 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-blue-500" />
                          {item.room} ({item.building})
                        </span>
                        {!isBreak && (
                          <span className="flex items-center gap-1">
                            <User className="w-3.5 h-3.5 text-slate-400" />
                            {item.faculty}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {!isBreak && item.roomId && (
                    <button
                      onClick={() => navigate(`/rooms/${item.roomId}`)}
                      className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 shrink-0 self-end sm:self-center"
                    >
                      Room Details →
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Campus Announcements (Read-Only) */}
          <div
            className="p-4 rounded-xl border mt-6 space-y-2.5"
            style={{ backgroundColor: 'var(--surface-2)', borderColor: 'var(--border-primary)' }}
          >
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-blue-500" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Live Timetable Notice
              </h3>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              <strong>DBMS Lab Session Relocation:</strong> Tuesday afternoon DBMS lab practicals will be held in <strong>Lab A</strong> to provide specialized high-performance workstations for all 65 students.
            </p>
          </div>
        </div>

        {/* Right Column: Vacant Study Spaces & Enrolled Courses */}
        <div className="lg:col-span-5 space-y-6">
          {/* Vacant Study Spaces */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                  Vacant Study Spaces
                </h2>
                <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                  Rooms currently free for self-study and revision
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/rooms')}
                icon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                All Rooms
              </Button>
            </div>

            <div className="space-y-2.5">
              {vacantStudyRooms.map((room) => (
                <div
                  key={room.id}
                  className="p-3.5 rounded-xl border transition-all hover:border-blue-500/40"
                  style={{ backgroundColor: 'var(--surface-1)', borderColor: 'var(--border-primary)' }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                          {room.name}
                        </h4>
                        <span className="pill pill-success text-[10px] font-semibold">
                          Free until {room.freeUntil}
                        </span>
                      </div>
                      <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
                        {room.building} • Capacity: {room.capacity} seats
                      </p>
                    </div>

                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => navigate(`/rooms/${room.id}`)}
                    >
                      View
                    </Button>
                  </div>

                  <div className="flex items-center gap-3 mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <Wifi className="w-3 h-3 text-emerald-500" />
                      Wi-Fi
                    </span>
                    <span className="flex items-center gap-1">
                      <Wind className="w-3 h-3 text-blue-500" />
                      AC
                    </span>
                    <span className="flex items-center gap-1">
                      <Zap className="w-3 h-3 text-amber-500" />
                      Power
                    </span>
                    <span className="ml-auto font-medium text-slate-600 dark:text-slate-300">
                      Best for: {room.recommendedFor}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Enrolled Courses Summary */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                Enrolled Courses (Sem 5)
              </h2>
              <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                5 Subjects
              </span>
            </div>

            <div
              className="rounded-xl border overflow-hidden"
              style={{ backgroundColor: 'var(--surface-1)', borderColor: 'var(--border-primary)' }}
            >
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {enrolledCourses.map((c) => (
                  <div key={c.code} className="p-3 flex items-center justify-between gap-2 text-xs">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-blue-600 dark:text-blue-400 text-[11px]">
                          {c.code}
                        </span>
                        <span className="font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                          {c.name}
                        </span>
                      </div>
                      <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
                        {c.faculty} • {c.credits} Credits
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                        {c.attendance}
                      </span>
                      <p className="text-[10px] text-slate-400">Attended</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
