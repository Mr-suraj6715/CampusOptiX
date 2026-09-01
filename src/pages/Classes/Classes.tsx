import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  Plus,
  BookOpen,
  Users,
  DoorOpen,
  Clock,
  Search,
  Filter,
  Eye,
  Edit2,
  Trash2,
  CheckCircle2,
  Sparkles,
  Layers,
  Calendar,
  Monitor,
  Check,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { SearchBar } from '@/components/shared/SearchBar';
import { EmptyState } from '@/components/shared/EmptyState';
import { mockClassesList, mockRooms, mockFacultyList } from '@/data/mockData';
import type { ClassCourse, RoomType } from '@/types';

export const Classes = () => {
  const navigate = useNavigate();
  const [classesList, setClassesList] = useState<ClassCourse[]>(mockClassesList);

  // Filters & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('all');
  const [divisionFilter, setDivisionFilter] = useState('all');
  const [roomTypeFilter, setRoomTypeFilter] = useState('all');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassCourse | null>(null);
  const [viewingClass, setViewingClass] = useState<ClassCourse | null>(null);
  const [deleteConfirmClass, setDeleteConfirmClass] = useState<ClassCourse | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    code: '',
    subject: '',
    department: 'Computer Science',
    year: 2,
    division: 'Div A',
    students: 50,
    faculty: mockFacultyList[0].name,
    requiredRoomType: 'classroom' as RoomType,
    requiredEquipment: 'Projector, Whiteboard, Wi-Fi',
    assignedRoom: 'Room A101',
    timeSlot: 'Mon, Wed (09:00 - 10:00)',
    credits: 4,
    type: 'theory' as ClassCourse['type'],
  });

  const filteredClasses = useMemo(() => {
    return classesList.filter((c) => {
      const matchSearch =
        c.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.faculty.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.assignedRoom.toLowerCase().includes(searchQuery.toLowerCase());

      const matchDept = deptFilter === 'all' || c.department === deptFilter;
      const matchYear = yearFilter === 'all' || c.year === Number(yearFilter);
      const matchDivision = divisionFilter === 'all' || c.division === divisionFilter;
      const matchRoomType = roomTypeFilter === 'all' || c.requiredRoomType === roomTypeFilter;

      return matchSearch && matchDept && matchYear && matchDivision && matchRoomType;
    });
  }, [classesList, searchQuery, deptFilter, yearFilter, divisionFilter, roomTypeFilter]);

  const handleOpenAddModal = () => {
    setFormData({
      code: `CS${300 + classesList.length}`,
      subject: 'Cloud Systems Architecture',
      department: 'Computer Science',
      year: 3,
      division: 'Div A',
      students: 52,
      faculty: mockFacultyList[0].name,
      requiredRoomType: 'classroom',
      requiredEquipment: 'Projector, High-Speed LAN, AC Unit',
      assignedRoom: 'Room A101',
      timeSlot: 'Tue, Thu (10:00 - 11:00)',
      credits: 4,
      type: 'theory',
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (item: ClassCourse) => {
    setEditingClass(item);
    setFormData({
      code: item.code,
      subject: item.subject,
      department: item.department,
      year: item.year,
      division: item.division,
      students: item.students,
      faculty: item.faculty,
      requiredRoomType: item.requiredRoomType,
      requiredEquipment: item.requiredEquipment.join(', '),
      assignedRoom: item.assignedRoom,
      timeSlot: item.timeSlot,
      credits: item.credits,
      type: item.type,
    });
  };

  const handleSaveClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingClass) {
      setClassesList((prev) =>
        prev.map((c) =>
          c.id === editingClass.id
            ? {
                ...c,
                code: formData.code,
                subject: formData.subject,
                department: formData.department,
                year: Number(formData.year),
                division: formData.division,
                students: Number(formData.students),
                faculty: formData.faculty,
                requiredRoomType: formData.requiredRoomType,
                requiredEquipment: formData.requiredEquipment.split(',').map((s) => s.trim()),
                assignedRoom: formData.assignedRoom,
                timeSlot: formData.timeSlot,
                credits: Number(formData.credits),
                type: formData.type,
              }
            : c
        )
      );
      setEditingClass(null);
      setToastMessage(`Class ${formData.code} updated successfully.`);
    } else {
      const newClass: ClassCourse = {
        id: `CLS00${classesList.length + 1}`,
        code: formData.code,
        subject: formData.subject,
        department: formData.department,
        year: Number(formData.year),
        division: formData.division,
        students: Number(formData.students),
        faculty: formData.faculty,
        requiredRoomType: formData.requiredRoomType,
        requiredEquipment: formData.requiredEquipment.split(',').map((s) => s.trim()),
        assignedRoom: formData.assignedRoom,
        timeSlot: formData.timeSlot,
        credits: Number(formData.credits),
        type: formData.type,
      };
      setClassesList((prev) => [newClass, ...prev]);
      setIsAddModalOpen(false);
      setToastMessage(`Class ${newClass.code} created and scheduled.`);
    }
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleDeleteClass = () => {
    if (!deleteConfirmClass) return;
    setClassesList((prev) => prev.filter((c) => c.id !== deleteConfirmClass.id));
    setDeleteConfirmClass(null);
    setToastMessage('Class removed from schedule.');
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
              Class & Course Management
            </h1>
            <Badge variant="info">{filteredClasses.length} of {classesList.length} Classes</Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage course codes, divisions, student enrollments, equipment constraints, and venue allocations.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={handleOpenAddModal}
          icon={<Plus className="w-4 h-4" />}
        >
          Add Class
        </Button>
      </div>

      {/* Filter and Search Card */}
      <Card padding="sm" className="space-y-3">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by code, subject, instructor, or room..."
            className="max-w-md w-full"
          />

          <div className="flex flex-wrap items-center gap-2.5">
            <Select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              options={[
                { value: 'all', label: 'All Departments' },
                { value: 'Computer Science', label: 'Computer Science' },
                { value: 'Mathematics', label: 'Mathematics' },
                { value: 'Physics', label: 'Physics' },
                { value: 'Chemistry', label: 'Chemistry' },
              ]}
              className="py-1.5 text-xs w-38"
            />

            <Select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              options={[
                { value: 'all', label: 'All Academic Years' },
                { value: '1', label: '1st Year' },
                { value: '2', label: '2nd Year' },
                { value: '3', label: '3rd Year' },
                { value: '4', label: '4th Year' },
              ]}
              className="py-1.5 text-xs w-36"
            />

            <Select
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

            <Select
              value={roomTypeFilter}
              onChange={(e) => setRoomTypeFilter(e.target.value)}
              options={[
                { value: 'all', label: 'All Room Types' },
                { value: 'classroom', label: 'Classroom' },
                { value: 'computer-lab', label: 'Computer Lab' },
                { value: 'lecture-hall', label: 'Lecture Hall' },
                { value: 'laboratory', label: 'Lab Facility' },
              ]}
              className="py-1.5 text-xs w-36"
            />
          </div>
        </div>
      </Card>

      {/* Classes Table */}
      {filteredClasses.length === 0 ? (
        <EmptyState
          icon={<BookOpen className="w-6 h-6" />}
          title="No Classes Found"
          description="No classes match your filter parameters. Try clearing the filter."
        />
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold uppercase text-[11px]">
                <tr>
                  <th className="px-4 py-3">Course Code & Subject</th>
                  <th className="px-4 py-3">Department</th>
                  <th className="px-4 py-3">Year / Div</th>
                  <th className="px-4 py-3">Students</th>
                  <th className="px-4 py-3">Faculty</th>
                  <th className="px-4 py-3">Required Venue & Gear</th>
                  <th className="px-4 py-3">Assigned Room</th>
                  <th className="px-4 py-3">Time Slot</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {filteredClasses.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group cursor-pointer"
                    onClick={() => setViewingClass(item)}
                  >
                    {/* Course Code & Subject */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-1 rounded text-xs">
                          {item.code}
                        </span>
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 transition-colors">
                            {item.subject}
                          </p>
                          <p className="text-[11px] text-slate-400 font-mono">
                            {item.credits} Credits • {item.type}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Department */}
                    <td className="px-4 py-3.5 text-slate-600 dark:text-slate-300">
                      {item.department}
                    </td>

                    {/* Year & Division */}
                    <td className="px-4 py-3.5 font-semibold text-slate-700 dark:text-slate-300">
                      <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-xs">
                        Year {item.year} • {item.division}
                      </span>
                    </td>

                    {/* Students */}
                    <td className="px-4 py-3.5 font-semibold text-slate-900 dark:text-slate-100">
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        <span>{item.students} Enrolled</span>
                      </div>
                    </td>

                    {/* Faculty */}
                    <td className="px-4 py-3.5 font-medium text-slate-800 dark:text-slate-200">
                      {item.faculty}
                    </td>

                    {/* Required Room Type & Equipment */}
                    <td className="px-4 py-3.5">
                      <div className="space-y-1">
                        <Badge variant="purple" className="capitalize">
                          {item.requiredRoomType.replace('-', ' ')}
                        </Badge>
                        <p className="text-[11px] text-slate-400 truncate max-w-[150px]">
                          {item.requiredEquipment.join(', ')}
                        </p>
                      </div>
                    </td>

                    {/* Assigned Room */}
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-950/60 font-mono text-xs font-semibold text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                        <DoorOpen className="w-3.5 h-3.5" />
                        {item.assignedRoom}
                      </span>
                    </td>

                    {/* Time Slot */}
                    <td className="px-4 py-3.5 text-xs text-slate-600 dark:text-slate-400 font-mono">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{item.timeSlot}</span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setViewingClass(item)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/60 rounded-lg"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEditModal(item)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                          title="Edit Class"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmClass(item)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/60 rounded-lg"
                          title="Delete Class"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {viewingClass && (
        <Modal
          open={!!viewingClass}
          onClose={() => setViewingClass(null)}
          title={`Class Details: ${viewingClass.code} - ${viewingClass.subject}`}
          description="Complete course metadata, cohort capacity, and allocated venue specs."
          size="md"
          footer={
            <div className="flex items-center justify-between w-full">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const item = viewingClass;
                  setViewingClass(null);
                  handleOpenEditModal(item);
                }}
                icon={<Edit2 className="w-3.5 h-3.5" />}
              >
                Edit Class Info
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setViewingClass(null)}
              >
                Close
              </Button>
            </div>
          }
        >
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-[11px] text-slate-400 font-semibold uppercase">Course Code</span>
                <p className="text-sm font-bold text-blue-600 dark:text-blue-400 font-mono">{viewingClass.code}</p>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 font-semibold uppercase">Subject</span>
                <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{viewingClass.subject}</p>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 font-semibold uppercase">Department</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200">{viewingClass.department}</p>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 font-semibold uppercase">Cohort / Division</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200">Year {viewingClass.year} • {viewingClass.division}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[11px] text-slate-400 font-semibold uppercase">Instructor In-Charge</span>
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{viewingClass.faculty}</p>
                <p className="text-slate-500">Scheduled Time: <strong>{viewingClass.timeSlot}</strong></p>
              </div>

              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[11px] text-slate-400 font-semibold uppercase">Allocated Venue</span>
                <p className="text-sm font-bold text-blue-600 dark:text-blue-400">{viewingClass.assignedRoom}</p>
                <p className="text-slate-500">Cohort Size: <strong>{viewingClass.students} Students</strong></p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900 space-y-1.5">
              <p className="font-semibold text-blue-900 dark:text-blue-200">
                Required Venue Specifications & Hardware:
              </p>
              <div className="flex items-center gap-2 flex-wrap pt-1">
                <Badge variant="purple">Venue: {viewingClass.requiredRoomType}</Badge>
                {viewingClass.requiredEquipment.map((eq, i) => (
                  <Badge key={i} variant="info">{eq}</Badge>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Add / Edit Class Modal */}
      {(isAddModalOpen || editingClass) && (
        <Modal
          open={isAddModalOpen || !!editingClass}
          onClose={() => {
            setIsAddModalOpen(false);
            setEditingClass(null);
          }}
          title={editingClass ? `Edit Class: ${editingClass.code}` : 'Register New Class Offering'}
          description="Define course codes, academic year, division, student cap, and equipment constraints."
          size="lg"
          footer={
            <>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingClass(null);
                }}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleSaveClass}
              >
                {editingClass ? 'Save Changes' : 'Create Class'}
              </Button>
            </>
          }
        >
          <form onSubmit={handleSaveClass} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Course Code"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="e.g. CS201"
                required
              />
              <Input
                label="Subject Name"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="e.g. Data Structures"
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <Select
                label="Department"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                options={[
                  { value: 'Computer Science', label: 'Computer Science' },
                  { value: 'Mathematics', label: 'Mathematics' },
                  { value: 'Physics', label: 'Physics' },
                  { value: 'Chemistry', label: 'Chemistry' },
                ]}
              />
              <Select
                label="Academic Year"
                value={String(formData.year)}
                onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
                options={[
                  { value: '1', label: '1st Year' },
                  { value: '2', label: '2nd Year' },
                  { value: '3', label: '3rd Year' },
                  { value: '4', label: '4th Year' },
                ]}
              />
              <Select
                label="Division"
                value={formData.division}
                onChange={(e) => setFormData({ ...formData, division: e.target.value })}
                options={[
                  { value: 'Div A', label: 'Div A' },
                  { value: 'Div B', label: 'Div B' },
                  { value: 'Div C', label: 'Div C' },
                ]}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Enrolled Students Count"
                type="number"
                min={1}
                max={300}
                value={formData.students}
                onChange={(e) => setFormData({ ...formData, students: Number(e.target.value) })}
                required
              />
              <Select
                label="Assigned Faculty"
                value={formData.faculty}
                onChange={(e) => setFormData({ ...formData, faculty: e.target.value })}
                options={mockFacultyList.map((f) => ({ value: f.name, label: f.name }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Required Room Type"
                value={formData.requiredRoomType}
                onChange={(e) => setFormData({ ...formData, requiredRoomType: e.target.value as any })}
                options={[
                  { value: 'classroom', label: 'Classroom' },
                  { value: 'computer-lab', label: 'Computer Lab' },
                  { value: 'lecture-hall', label: 'Lecture Hall' },
                  { value: 'seminar', label: 'Seminar Hall' },
                ]}
              />
              <Select
                label="Assigned Room / Venue"
                value={formData.assignedRoom}
                onChange={(e) => setFormData({ ...formData, assignedRoom: e.target.value })}
                options={[
                  ...mockRooms.map((r) => ({ value: r.name, label: `${r.name} (${r.capacity} cap)` })),
                  { value: 'CS Lab 1', label: 'CS Lab 1 (40 cap)' },
                  { value: 'DBMS Lab', label: 'DBMS Lab (40 cap)' },
                  { value: 'Chemistry Lab', label: 'Chemistry Lab (30 cap)' },
                ]}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Time Slot Allocation"
                value={formData.timeSlot}
                onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                placeholder="e.g. Mon, Wed (09:00 - 10:00)"
                required
              />
              <Input
                label="Required Equipment (comma separated)"
                value={formData.requiredEquipment}
                onChange={(e) => setFormData({ ...formData, requiredEquipment: e.target.value })}
                placeholder="e.g. Projector, Whiteboard, Wi-Fi"
                required
              />
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmClass && (
        <Modal
          open={!!deleteConfirmClass}
          onClose={() => setDeleteConfirmClass(null)}
          title="Delete Class"
          size="sm"
          footer={
            <>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setDeleteConfirmClass(null)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleDeleteClass}
              >
                Delete Class
              </Button>
            </>
          }
        >
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Are you sure you want to remove <strong className="text-slate-900 dark:text-slate-100">{deleteConfirmClass.code} - {deleteConfirmClass.subject} ({deleteConfirmClass.division})</strong>?
          </p>
        </Modal>
      )}
    </div>
  );
};

export default Classes;
