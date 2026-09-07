import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  DoorOpen,
  Users,
  Filter,
  Plus,
  Printer,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Sparkles,
  CheckCircle2,
  Building,
  GraduationCap,
  Layers,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { mockRooms, mockFacultyList, mockClassesList } from '@/data/mockData';
import { useAuth } from '@/context/AuthContext';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const;
const TIME_SLOTS = [
  '08:00 - 09:00',
  '09:00 - 10:00',
  '10:00 - 11:00',
  '11:00 - 12:00',
  '12:00 - 13:00', // Lunch
  '13:00 - 14:00',
  '14:00 - 15:00',
  '15:00 - 16:00',
  '16:00 - 17:00',
];

interface MatrixEntry {
  id: string;
  day: string;
  time: string;
  courseCode: string;
  subject: string;
  department: string;
  year: number;
  division: string;
  faculty: string;
  room: string;
  conflictType?: 'none' | 'double-booking' | 'capacity' | 'equipment';
  conflictReason?: string;
}

const initialSchedule: MatrixEntry[] = [
  {
    id: 'T1',
    day: 'Monday',
    time: '09:00 - 10:00',
    courseCode: 'CS201',
    subject: 'Data Structures',
    department: 'Computer Science',
    year: 2,
    division: 'Div A',
    faculty: 'Dr. Rajesh Kumar',
    room: 'Room A101',
    conflictType: 'none',
  },
  {
    id: 'T2',
    day: 'Monday',
    time: '10:00 - 11:00',
    courseCode: 'MA201',
    subject: 'Engineering Math III',
    department: 'Mathematics',
    year: 2,
    division: 'Div C',
    faculty: 'Prof. Suresh Nair',
    room: 'Room B204',
    conflictType: 'none',
  },
  {
    id: 'T3',
    day: 'Monday',
    time: '11:00 - 12:00',
    courseCode: 'CS151',
    subject: 'Programming Lab',
    department: 'Computer Science',
    year: 1,
    division: 'Div A',
    faculty: 'Dr. Dinesh Patel',
    room: 'CS Lab 1',
    conflictType: 'none',
  },
  {
    id: 'T4',
    day: 'Monday',
    time: '14:00 - 15:00',
    courseCode: 'PH101',
    subject: 'Engineering Physics',
    department: 'Physics',
    year: 1,
    division: 'Div A',
    faculty: 'Dr. Mohan Rao',
    room: 'Room D102',
    conflictType: 'none',
  },

  {
    id: 'T5',
    day: 'Tuesday',
    time: '09:00 - 10:00',
    courseCode: 'CS351',
    subject: 'DBMS Lab',
    department: 'Computer Science',
    year: 3,
    division: 'Div A',
    faculty: 'Dr. Priya Mehta',
    room: 'DBMS Lab',
    conflictType: 'capacity',
    conflictReason: 'Capacity Conflict: 65 enrolled students assigned to 40 workstation lab.',
  },
  {
    id: 'T6',
    day: 'Tuesday',
    time: '11:00 - 12:00',
    courseCode: 'CS202',
    subject: 'Design & Analysis of Algorithms',
    department: 'Computer Science',
    year: 2,
    division: 'Div B',
    faculty: 'Prof. Anita Sharma',
    room: 'Room A101',
    conflictType: 'none',
  },
  {
    id: 'T7',
    day: 'Tuesday',
    time: '14:00 - 15:00',
    courseCode: 'CS402',
    subject: 'Compiler Design',
    department: 'Computer Science',
    year: 4,
    division: 'Div A',
    faculty: 'Prof. Nandini Reddy',
    room: 'Room G101',
    conflictType: 'none',
  },

  {
    id: 'T8',
    day: 'Wednesday',
    time: '09:00 - 10:00',
    courseCode: 'CH201',
    subject: 'Organic Chemistry Lab',
    department: 'Chemistry',
    year: 2,
    division: 'Div B',
    faculty: 'Dr. Lakshmi Venkat',
    room: 'Chemistry Lab',
    conflictType: 'none',
  },
  {
    id: 'T9',
    day: 'Wednesday',
    time: '10:00 - 11:00',
    courseCode: 'CS201',
    subject: 'Data Structures',
    department: 'Computer Science',
    year: 2,
    division: 'Div A',
    faculty: 'Dr. Rajesh Kumar',
    room: 'Room A101',
    conflictType: 'none',
  },
  {
    id: 'T10',
    day: 'Wednesday',
    time: '14:00 - 15:00',
    courseCode: 'CS301',
    subject: 'Database Management Systems',
    department: 'Computer Science',
    year: 3,
    division: 'Div A',
    faculty: 'Dr. Priya Mehta',
    room: 'Room A101',
    conflictType: 'none',
  },

  {
    id: 'T11',
    day: 'Thursday',
    time: '10:00 - 11:00',
    courseCode: 'PH101',
    subject: 'Engineering Physics',
    department: 'Physics',
    year: 1,
    division: 'Div A',
    faculty: 'Dr. Mohan Rao',
    room: 'Room D102',
    conflictType: 'none',
  },
  {
    id: 'T12',
    day: 'Thursday',
    time: '14:00 - 15:00',
    courseCode: 'SEMINAR',
    subject: 'CS Research Seminar',
    department: 'Computer Science',
    year: 4,
    division: 'Div A',
    faculty: 'Dr. Rajesh Kumar',
    room: 'Room F410',
    conflictType: 'double-booking',
    conflictReason: 'Double-Booking: Room F410 booked for Faculty Assembly at same slot.',
  },

  {
    id: 'T13',
    day: 'Friday',
    time: '09:00 - 10:00',
    courseCode: 'MA201',
    subject: 'Engineering Math III',
    department: 'Mathematics',
    year: 2,
    division: 'Div A',
    faculty: 'Prof. Suresh Nair',
    room: 'Room B204',
    conflictType: 'none',
  },
  {
    id: 'T14',
    day: 'Friday',
    time: '11:00 - 12:00',
    courseCode: 'CS202',
    subject: 'Algorithms',
    department: 'Computer Science',
    year: 2,
    division: 'Div A',
    faculty: 'Prof. Anita Sharma',
    room: 'Room A101',
    conflictType: 'none',
  },
  {
    id: 'T15',
    day: 'Friday',
    time: '14:00 - 15:00',
    courseCode: 'RS401',
    subject: 'Research Methodology',
    department: 'Computer Science',
    year: 4,
    division: 'Div A',
    faculty: 'Dr. Kavitha Iyer',
    room: 'Room C305',
    conflictType: 'none',
  },
];

export const Timetable = () => {
  const { user } = useAuth();
  const isStudent = user?.role === 'STUDENT';
  const [scheduleData, setScheduleData] = useState<MatrixEntry[]>(initialSchedule);

  // Filters (Section 10 Requirements)
  const [deptFilter, setDeptFilter] = useState('all');
  const [facultyFilter, setFacultyFilter] = useState('all');
  const [roomFilter, setRoomFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('all');
  const [divisionFilter, setDivisionFilter] = useState('all');

  // Slot Details / Booking Modal
  const [selectedSlot, setSelectedSlot] = useState<{ day: string; time: string; entry?: MatrixEntry } | null>(null);
  const [slotForm, setSlotForm] = useState({
    courseCode: 'CS201',
    subject: 'Data Structures',
    department: 'Computer Science',
    year: 2,
    division: 'Div A',
    faculty: mockFacultyList[0].name,
    room: 'Room A101',
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const filteredSchedule = scheduleData.filter((item) => {
    const matchDept = deptFilter === 'all' || item.department === deptFilter;
    const matchFaculty = facultyFilter === 'all' || item.faculty === facultyFilter;
    const matchRoom = roomFilter === 'all' || item.room.toLowerCase().includes(roomFilter.toLowerCase());
    const matchYear = yearFilter === 'all' || item.year === Number(yearFilter);
    const matchDivision = divisionFilter === 'all' || item.division === divisionFilter;

    return matchDept && matchFaculty && matchRoom && matchYear && matchDivision;
  });

  const getEntryForSlot = (day: string, time: string) => {
    return filteredSchedule.find((s) => s.day === day && s.time === time);
  };

  const handleCellClick = (day: string, time: string) => {
    const existing = scheduleData.find((s) => s.day === day && s.time === time);
    setSelectedSlot({ day, time, entry: existing });
    if (existing) {
      setSlotForm({
        courseCode: existing.courseCode,
        subject: existing.subject,
        department: existing.department,
        year: existing.year,
        division: existing.division,
        faculty: existing.faculty,
        room: existing.room,
      });
    } else {
      setSlotForm({
        courseCode: 'CS201',
        subject: 'Data Structures',
        department: 'Computer Science',
        year: 2,
        division: 'Div A',
        faculty: mockFacultyList[0].name,
        room: 'Room A101',
      });
    }
  };

  const handleSaveSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) return;

    const updated = scheduleData.filter(
      (s) => !(s.day === selectedSlot.day && s.time === selectedSlot.time)
    );

    const newEntry: MatrixEntry = {
      id: `T${Date.now()}`,
      day: selectedSlot.day,
      time: selectedSlot.time,
      courseCode: slotForm.courseCode,
      subject: slotForm.subject,
      department: slotForm.department,
      year: Number(slotForm.year),
      division: slotForm.division,
      faculty: slotForm.faculty,
      room: slotForm.room,
      conflictType: 'none',
    };

    setScheduleData([...updated, newEntry]);
    setSelectedSlot(null);
    setToastMessage(`Timetable updated for ${selectedSlot.day} (${selectedSlot.time})`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleDeleteSlot = () => {
    if (!selectedSlot) return;
    setScheduleData((prev) =>
      prev.filter((s) => !(s.day === selectedSlot.day && s.time === selectedSlot.time))
    );
    setSelectedSlot(null);
    setToastMessage('Slot booking cleared.');
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
            <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 dark:from-cyan-300 dark:via-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
              Campus Master Timetable
            </h1>
            <Badge variant="info">Matrix View</Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Visual weekly matrix with department, instructor, year, and division filters plus conflict highlighting.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => window.print()}
            icon={<Printer className="w-4 h-4" />}
          >
            Print Timetable
          </Button>
          {!isStudent && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleCellClick('Monday', '08:00 - 09:00')}
              icon={<Plus className="w-4 h-4" />}
            >
              Book Slot
            </Button>
          )}
        </div>
      </div>

      {/* Multi-Filter Bar (Section 10 Requirements) */}
      <Card padding="sm" className="space-y-2.5">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Department Filter */}
          <Select
            label=""
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            options={[
              { value: 'all', label: 'All Departments' },
              { value: 'Computer Science', label: 'Computer Science' },
              { value: 'Mathematics', label: 'Mathematics' },
              { value: 'Physics', label: 'Physics' },
              { value: 'Chemistry', label: 'Chemistry' },
            ]}
            className="py-1.5 text-xs w-40"
          />

          {/* Faculty Filter */}
          <Select
            label=""
            value={facultyFilter}
            onChange={(e) => setFacultyFilter(e.target.value)}
            options={[
              { value: 'all', label: 'All Faculty' },
              ...mockFacultyList.map((f) => ({ value: f.name, label: f.name })),
            ]}
            className="py-1.5 text-xs w-44"
          />

          {/* Room Filter */}
          <Select
            label=""
            value={roomFilter}
            onChange={(e) => setRoomFilter(e.target.value)}
            options={[
              { value: 'all', label: 'All Rooms & Labs' },
              { value: 'Room A101', label: 'Room A101' },
              { value: 'Room B204', label: 'Room B204' },
              { value: 'Room C305', label: 'Room C305' },
              { value: 'Room D102', label: 'Room D102' },
              { value: 'CS Lab 1', label: 'CS Lab 1' },
              { value: 'DBMS Lab', label: 'DBMS Lab' },
            ]}
            className="py-1.5 text-xs w-38"
          />

          {/* Year Filter */}
          <Select
            label=""
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            options={[
              { value: 'all', label: 'All Years' },
              { value: '1', label: 'Year 1' },
              { value: '2', label: 'Year 2' },
              { value: '3', label: 'Year 3' },
              { value: '4', label: 'Year 4' },
            ]}
            className="py-1.5 text-xs w-32"
          />

          {/* Division Filter */}
          <Select
            label=""
            value={divisionFilter}
            onChange={(e) => setDivisionFilter(e.target.value)}
            options={[
              { value: 'all', label: 'All Divisions' },
              { value: 'Div A', label: 'Div A' },
              { value: 'Div B', label: 'Div B' },
              { value: 'Div C', label: 'Div C' },
            ]}
            className="py-1.5 text-xs w-32"
          />
        </div>

        {/* Visual State Legend */}
        <div className="flex items-center gap-4 text-xs text-slate-800 dark:text-slate-200 font-semibold pt-1 border-t border-slate-200 dark:border-slate-800 flex-wrap">
          <span className="font-bold text-slate-950 dark:text-white">Slot Status Legend:</span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-blue-500" />
            Standard Theory Lecture
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-purple-500" />
            Laboratory Practical
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-red-500 ring-2 ring-red-300" />
            Double-Booking / Room-Time Conflict
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-amber-500 ring-2 ring-amber-300" />
            Capacity Overload Warning
          </span>
        </div>
      </Card>

      {/* Timetable Matrix Grid (Section 10: Rows = Time slots, Columns = Monday-Saturday) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800 border-b-2 border-slate-300 dark:border-slate-600 font-bold uppercase tracking-widest text-[11px]">
                <th className="p-3.5 text-center border-r border-slate-300 dark:border-slate-600 w-32 min-w-[130px] text-amber-700 dark:text-amber-300 whitespace-nowrap">
                  Time Slot
                </th>
                {DAYS.map((day) => (
                  <th
                    key={day}
                    className="p-3.5 text-center border-r border-slate-300 dark:border-slate-600 last:border-r-0 min-w-[180px] w-[14.28%] text-blue-700 dark:text-cyan-300 whitespace-nowrap"
                  >
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-xs">
              {TIME_SLOTS.map((slotTime) => {
                const isLunchBreak = slotTime.includes('12:00 - 13:00');

                if (isLunchBreak) {
                  return (
                    <tr key={slotTime} className="bg-slate-100/60 dark:bg-slate-800/30">
                      <td className="p-3 font-mono font-bold text-amber-700 dark:text-amber-300 border-r border-slate-200 dark:border-slate-800 text-center align-middle whitespace-nowrap">
                        {slotTime}
                      </td>
                      <td
                        colSpan={DAYS.length}
                        className="p-3 text-center text-amber-700 dark:text-amber-300 font-bold uppercase tracking-wider text-[11px] align-middle"
                      >
                        — Campus Lunch Break & Resource Calibration Window —
                      </td>
                    </tr>
                  );
                }

                return (
                  <tr key={slotTime} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                    <td className="p-3 font-mono font-bold text-amber-700 dark:text-amber-300 border-r border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 text-xs text-center align-middle whitespace-nowrap">
                      {slotTime}
                    </td>

                    {DAYS.map((day) => {
                      const entry = getEntryForSlot(day, slotTime);

                      return (
                        <td
                          key={day}
                          onClick={() => handleCellClick(day, slotTime)}
                          className="p-2 border-r border-slate-200 dark:border-slate-800 last:border-r-0 align-top cursor-pointer hover:bg-blue-50/30 dark:hover:bg-blue-950/20 transition-all h-[96px]"
                        >
                          {entry ? (
                            <div
                              className={`p-2.5 rounded-xl border text-xs flex flex-col justify-between h-full min-h-[84px] space-y-1.5 transition-all shadow-xs ${
                                entry.conflictType === 'double-booking'
                                  ? 'bg-red-50 dark:bg-red-950/60 border-red-400 dark:border-red-800 ring-1 ring-red-400'
                                  : entry.conflictType === 'capacity'
                                  ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-400 dark:border-amber-800 ring-1 ring-amber-400'
                                  : entry.room.includes('Lab')
                                  ? 'bg-purple-50/80 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800'
                                  : 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800'
                              }`}
                            >
                              {/* Subject & Code */}
                              <div className="flex items-center justify-between gap-1">
                                <span className="font-bold text-slate-900 dark:text-white truncate">
                                  {entry.subject}
                                </span>
                                <span className="font-mono text-[10px] font-bold text-blue-700 dark:text-cyan-300 shrink-0">
                                  {entry.courseCode}
                                </span>
                              </div>

                              {/* Faculty */}
                              <p className="text-[11px] text-blue-700 dark:text-sky-200 truncate font-medium">
                                {entry.faculty}
                              </p>

                              {/* Room & Class/Division (Section 10 Requirements) */}
                              <div className="flex items-center justify-between text-[10px] font-semibold pt-0.5">
                                <span className="px-1.5 py-0.2 rounded bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-600 font-mono whitespace-nowrap">
                                  {entry.room}
                                </span>
                                <span className="px-1.5 py-0.2 rounded bg-blue-100/90 dark:bg-blue-900/80 text-blue-900 dark:text-blue-100 font-mono whitespace-nowrap">
                                  Yr {entry.year} • {entry.division}
                                </span>
                              </div>

                              {/* Conflict Alerts */}
                              {entry.conflictType !== 'none' && (
                                <div className="flex items-center gap-1 text-[10px] font-bold text-red-600 dark:text-red-400 pt-0.5 animate-pulse">
                                  <AlertTriangle className="w-3 h-3 shrink-0" />
                                  <span>{entry.conflictType === 'capacity' ? 'Capacity Overload' : 'Conflict'}</span>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="h-full min-h-[84px] flex items-center justify-center border border-dashed border-transparent hover:border-slate-300 dark:hover:border-slate-700 rounded-lg group">
                              <span className="text-[11px] text-slate-600 dark:text-slate-400 group-hover:text-blue-600 font-semibold whitespace-nowrap">
                                + Available
                              </span>
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slot Details / Booking Modal */}
      {selectedSlot && (
        <Modal
          open={!!selectedSlot}
          onClose={() => setSelectedSlot(null)}
          title={
            isStudent
              ? selectedSlot.entry
                ? `Lecture Info: ${selectedSlot.entry.subject}`
                : `Vacant Time Slot`
              : selectedSlot.entry
              ? `Edit Schedule: ${selectedSlot.entry.courseCode}`
              : `Book Timetable Slot`
          }
          description={
            isStudent
              ? `${selectedSlot.day} • ${selectedSlot.time}`
              : `Configure academic slot allocation for ${selectedSlot.day} (${selectedSlot.time})`
          }
          size="md"
          footer={
            isStudent ? (
              <Button variant="secondary" size="sm" onClick={() => setSelectedSlot(null)}>
                Close
              </Button>
            ) : (
              <div className="flex items-center justify-between w-full">
                {selectedSlot.entry ? (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={handleDeleteSlot}
                  >
                    Clear Booking
                  </Button>
                ) : <div />}

                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setSelectedSlot(null)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleSaveSlot}
                  >
                    Save Timetable Slot
                  </Button>
                </div>
              </div>
            )
          }
        >
          {isStudent ? (
            selectedSlot.entry ? (
              <div className="space-y-4 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-mono font-bold text-blue-600 dark:text-blue-400 text-xs">
                        {selectedSlot.entry.courseCode}
                      </span>
                      <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                        {selectedSlot.entry.subject}
                      </h3>
                    </div>
                    <Badge variant={selectedSlot.entry.subject.toLowerCase().includes('lab') ? 'purple' : 'info'}>
                      {selectedSlot.entry.subject.toLowerCase().includes('lab') ? 'Practical Lab' : 'Theory Lecture'}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200 dark:border-slate-700">
                    <div>
                      <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200">Instructor / Faculty</p>
                      <p className="font-semibold text-slate-900 dark:text-white mt-0.5">
                        {selectedSlot.entry.faculty}
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200">Venue / Room</p>
                      <p className="font-semibold text-blue-700 dark:text-blue-300 mt-0.5">
                        {selectedSlot.entry.room}
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200">Target Batch</p>
                      <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                        Year {selectedSlot.entry.year} • {selectedSlot.entry.division}
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200">Department</p>
                      <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                        {selectedSlot.entry.department}
                      </p>
                    </div>
                  </div>
                </div>

                {selectedSlot.entry.conflictType && selectedSlot.entry.conflictType !== 'none' && (
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-200 text-xs flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">Relocation / Optimization Notice</p>
                      <p className="mt-0.5 font-medium">{selectedSlot.entry.conflictReason || 'Space optimization in progress by administration.'}</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-6 text-center space-y-2">
                <DoorOpen className="w-8 h-8 text-emerald-500 mx-auto" />
                <h4 className="font-bold text-sm text-slate-950 dark:text-white">
                  Vacant Slot ({selectedSlot.day} • {selectedSlot.time})
                </h4>
                <p className="text-xs font-medium text-slate-700 dark:text-slate-200 max-w-sm mx-auto">
                  No lecture or practical is scheduled for this time slot. Classrooms and study lounges are open for self-study and revision.
                </p>
              </div>
            )
          ) : (
            <form onSubmit={handleSaveSlot} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Course Code"
                  value={slotForm.courseCode}
                  onChange={(e) => setSlotForm({ ...slotForm, courseCode: e.target.value })}
                  required
                />
                <Input
                  label="Subject Name"
                  value={slotForm.subject}
                  onChange={(e) => setSlotForm({ ...slotForm, subject: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <Select
                  label="Department"
                  value={slotForm.department}
                  onChange={(e) => setSlotForm({ ...slotForm, department: e.target.value })}
                  options={[
                    { value: 'Computer Science', label: 'Computer Science' },
                    { value: 'Mathematics', label: 'Mathematics' },
                    { value: 'Physics', label: 'Physics' },
                    { value: 'Chemistry', label: 'Chemistry' },
                  ]}
                />
                <Select
                  label="Year"
                  value={String(slotForm.year)}
                  onChange={(e) => setSlotForm({ ...slotForm, year: Number(e.target.value) })}
                  options={[
                    { value: '1', label: 'Year 1' },
                    { value: '2', label: 'Year 2' },
                    { value: '3', label: 'Year 3' },
                    { value: '4', label: 'Year 4' },
                  ]}
                />
                <Select
                  label="Division"
                  value={slotForm.division}
                  onChange={(e) => setSlotForm({ ...slotForm, division: e.target.value })}
                  options={[
                    { value: 'Div A', label: 'Div A' },
                    { value: 'Div B', label: 'Div B' },
                    { value: 'Div C', label: 'Div C' },
                  ]}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Faculty Member"
                  value={slotForm.faculty}
                  onChange={(e) => setSlotForm({ ...slotForm, faculty: e.target.value })}
                  options={mockFacultyList.map((f) => ({ value: f.name, label: f.name }))}
                />
                <Select
                  label="Assigned Room"
                  value={slotForm.room}
                  onChange={(e) => setSlotForm({ ...slotForm, room: e.target.value })}
                  options={[
                    ...mockRooms.map((r) => ({ value: r.name, label: r.name })),
                    { value: 'CS Lab 1', label: 'CS Lab 1' },
                    { value: 'DBMS Lab', label: 'DBMS Lab' },
                    { value: 'Chemistry Lab', label: 'Chemistry Lab' },
                  ]}
                />
              </div>
            </form>
          )}
        </Modal>
      )}
    </div>
  );
};

export default Timetable;
