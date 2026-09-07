import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  DoorOpen,
  GraduationCap,
  Users,
  BookOpen,
  FlaskConical,
  CheckCircle2,
  ArrowRight,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export const FacultyDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Today's lectures to conduct
  const todaysTeachingSchedule = [
    {
      id: 'f1',
      time: '09:00 - 10:00 AM',
      courseCode: 'CS201',
      subject: 'Data Structures',
      room: 'Room A101',
      roomId: 'R001',
      building: 'Block A, Floor 1',
      batch: 'Yr 2 • Div A',
      studentsCount: 60,
      type: 'Lecture',
    },
    {
      id: 'f2',
      time: '11:00 - 12:00 PM',
      courseCode: 'CS151',
      subject: 'Programming Lab Session',
      room: 'CS Lab 1',
      roomId: 'L001',
      building: 'Block A, Floor 1',
      batch: 'Yr 1 • Div A',
      studentsCount: 35,
      type: 'Practical',
    },
    {
      id: 'f3',
      time: '02:00 - 03:00 PM',
      courseCode: 'CS301',
      subject: 'Database Systems',
      room: 'Room B204',
      roomId: 'R002',
      building: 'Block B, Floor 2',
      batch: 'Yr 3 • Div B',
      studentsCount: 55,
      type: 'Lecture',
    },
  ];

  // Assigned courses
  const assignedCourses = [
    { code: 'CS201', name: 'Data Structures', batch: '2nd Year (Div A)', hours: '4 hrs/wk', strength: 60 },
    { code: 'CS151', name: 'Programming Lab', batch: '1st Year (Div A)', hours: '4 hrs/wk', strength: 35 },
    { code: 'CS301', name: 'Database Management Systems', batch: '3rd Year (Div B)', hours: '4 hrs/wk', strength: 55 },
    { code: 'CS401', name: 'Advanced Algorithms (Elective)', batch: '4th Year (Div A)', hours: '4 hrs/wk', strength: 40 },
  ];

  return (
    <div className="space-y-6">
      {/* Faculty Hero Banner */}
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
              <span className="pill pill-success font-mono text-[10px] uppercase">
                Faculty Portal
              </span>
              <span className="text-[12px] font-medium" style={{ color: 'var(--text-tertiary)' }}>
                {user?.department || 'Department of Computer Science & Engineering'}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 via-teal-600 to-emerald-600 dark:from-cyan-400 dark:via-teal-300 dark:to-emerald-300 bg-clip-text text-transparent">
              Welcome back, {user?.name || 'Prof. Rajesh Sharma'} 👋
            </h1>
            <p className="text-[13px] max-w-xl" style={{ color: 'var(--text-secondary)' }}>
              Manage your assigned course batches, review today's lecture schedule, and inspect specialized laboratories.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate('/classes')}
              icon={<GraduationCap className="w-4 h-4" />}
            >
              My Classes
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/timetable')}
              icon={<Calendar className="w-4 h-4" />}
            >
              Full Timetable →
            </Button>
          </div>
        </div>
      </div>

      {/* Faculty KPI Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div
          className="p-4 rounded-xl border transition-all"
          style={{ backgroundColor: 'var(--surface-1)', borderColor: 'var(--border-primary)' }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold" style={{ color: 'var(--text-tertiary)' }}>Today's Lectures</span>
            <span className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2.5">
            <p className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>3</p>
            <p className="text-xs mt-0.5 text-blue-600 dark:text-blue-400 font-medium">
              Next @ 09:00 AM (Room A101)
            </p>
          </div>
        </div>

        <div
          className="p-4 rounded-xl border transition-all"
          style={{ backgroundColor: 'var(--surface-1)', borderColor: 'var(--border-primary)' }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold" style={{ color: 'var(--text-tertiary)' }}>Enrolled Students</span>
            <span className="p-2 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <Users className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2.5">
            <p className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>190</p>
            <p className="text-xs mt-0.5 text-purple-600 dark:text-purple-400 font-medium">
              Across 4 Course Sections
            </p>
          </div>
        </div>

        <div
          className="p-4 rounded-xl border transition-all"
          style={{ backgroundColor: 'var(--surface-1)', borderColor: 'var(--border-primary)' }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold" style={{ color: 'var(--text-tertiary)' }}>Weekly Workload</span>
            <span className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2.5">
            <p className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>16 Hrs</p>
            <p className="text-xs mt-0.5 text-emerald-600 dark:text-emerald-400 font-medium">
              Within 18 Hr Max Limit
            </p>
          </div>
        </div>

        <div
          className="p-4 rounded-xl border transition-all"
          style={{ backgroundColor: 'var(--surface-1)', borderColor: 'var(--border-primary)' }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold" style={{ color: 'var(--text-tertiary)' }}>Laboratories</span>
            <span className="p-2 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <FlaskConical className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2.5">
            <p className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>8 Labs</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
              Department Facilities
            </p>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Today's Teaching Schedule */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                Today's Teaching Schedule
              </h2>
              <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                Lectures and practical sessions assigned to you today
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/timetable')}
              icon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              Weekly Grid
            </Button>
          </div>

          <div className="space-y-3">
            {todaysTeachingSchedule.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl border transition-all hover:border-blue-500/40"
                style={{ backgroundColor: 'var(--surface-1)', borderColor: 'var(--border-primary)' }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        item.type === 'Practical'
                          ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400'
                          : 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400'
                      }`}
                    >
                      {item.type === 'Practical' ? <Sparkles className="w-5 h-5" /> : <BookOpen className="w-5 h-5" />}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                          {item.subject}
                        </span>
                        <span className="font-mono text-[11px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                          {item.courseCode}
                        </span>
                        <Badge variant={item.type === 'Practical' ? 'purple' : 'info'}>
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
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-slate-400" />
                          {item.batch} ({item.studentsCount} Students)
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate(`/rooms/${item.roomId}`)}
                    className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline shrink-0"
                  >
                    Room Info →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Assigned Courses */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                Assigned Courses
              </h2>
              <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                Your current semester course portfolio
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/classes')}
              icon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              Manage
            </Button>
          </div>

          <div
            className="rounded-xl border overflow-hidden"
            style={{ backgroundColor: 'var(--surface-1)', borderColor: 'var(--border-primary)' }}
          >
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {assignedCourses.map((c) => (
                <div key={c.code} className="p-3.5 flex items-center justify-between gap-2 text-xs">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-blue-600 dark:text-blue-400 text-[11px]">
                        {c.code}
                      </span>
                      <span className="font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                        {c.name}
                      </span>
                    </div>
                    <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
                      {c.batch} • {c.hours}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <Badge variant="slate">{c.strength} Students</Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;
