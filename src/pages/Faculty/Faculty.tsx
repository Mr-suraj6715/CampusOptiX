import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Plus,
  Mail,
  Phone,
  BookOpen,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Search,
  Filter,
  Layers,
  Building,
  Clock,
  Eye,
  Edit2,
  Trash2,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { SearchBar } from '@/components/shared/SearchBar';
import { EmptyState } from '@/components/shared/EmptyState';
import { mockFacultyList } from '@/data/mockData';
import type { Faculty, FacultyStatus } from '@/types';
import { useAuth } from '@/context/AuthContext';

export const FacultyPage = () => {
  const { user } = useAuth();
  const isStudent = user?.role === 'STUDENT';
  const navigate = useNavigate();
  const [facultyList, setFacultyList] = useState<Faculty[]>(mockFacultyList);
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [buildingPrefFilter, setBuildingPrefFilter] = useState('all');

  // Modals
  const [selectedFacultyProfile, setSelectedFacultyProfile] = useState<Faculty | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState<Faculty | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: 'Computer Science',
    designation: 'Assistant Professor',
    status: 'active' as FacultyStatus,
    availability: 'Mon, Tue, Wed, Thu, Fri',
    preferredTime: 'Morning (09:00 - 13:00)',
    preferredBuilding: 'Block A',
    assignedClasses: 'CS201 (Div A)',
    maxWorkload: 18,
    specialization: 'Artificial Intelligence, Algorithms',
  });

  const filteredFaculty = useMemo(() => {
    return facultyList.filter((f) => {
      const matchSearch =
        f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.assignedClasses.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchDept = deptFilter === 'all' || f.department === deptFilter;
      const matchStatus = statusFilter === 'all' || f.status === statusFilter;
      const matchBuilding = buildingPrefFilter === 'all' || f.preferredBuilding === buildingPrefFilter;

      return matchSearch && matchDept && matchStatus && matchBuilding;
    });
  }, [facultyList, searchQuery, deptFilter, statusFilter, buildingPrefFilter]);

  const handleOpenAddModal = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      department: 'Computer Science',
      designation: 'Assistant Professor',
      status: 'active',
      availability: 'Mon, Tue, Wed, Thu, Fri',
      preferredTime: 'Morning (09:00 - 13:00)',
      preferredBuilding: 'Block A',
      assignedClasses: 'CS201 (Div A)',
      maxWorkload: 18,
      specialization: 'Distributed Systems, Cloud',
    });
    setIsAddModalOpen(true);
  };

  const handleSaveFaculty = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingFaculty) {
      setFacultyList((prev) =>
        prev.map((f) =>
          f.id === editingFaculty.id
            ? {
                ...f,
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                department: formData.department,
                designation: formData.designation,
                status: formData.status,
                availability: formData.availability.split(',').map((s) => s.trim()),
                preferredTime: formData.preferredTime,
                preferredBuilding: formData.preferredBuilding,
                assignedClasses: formData.assignedClasses.split(',').map((s) => s.trim()),
                maxWorkload: Number(formData.maxWorkload),
                specialization: formData.specialization.split(',').map((s) => s.trim()),
              }
            : f
        )
      );
      setEditingFaculty(null);
      setToastMessage(`Faculty ${formData.name} updated successfully.`);
    } else {
      const newFac: Faculty = {
        id: `FAC00${facultyList.length + 1}`,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        department: formData.department,
        designation: formData.designation,
        status: formData.status,
        availability: formData.availability.split(',').map((s) => s.trim()),
        preferredTime: formData.preferredTime,
        preferredBuilding: formData.preferredBuilding,
        assignedClasses: formData.assignedClasses.split(',').map((s) => s.trim()),
        workload: 8,
        maxWorkload: Number(formData.maxWorkload),
        specialization: formData.specialization.split(',').map((s) => s.trim()),
        potentialConflicts: [],
        schedule: [],
      };
      setFacultyList((prev) => [newFac, ...prev]);
      setIsAddModalOpen(false);
      setToastMessage(`Faculty ${newFac.name} profile created.`);
    }
    setTimeout(() => setToastMessage(null), 3500);
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
            <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 via-teal-600 to-emerald-600 dark:from-cyan-400 dark:via-teal-300 dark:to-emerald-300 bg-clip-text text-transparent">
              Faculty Directory & Profile Center
            </h1>
            <Badge variant="info">{filteredFaculty.length} Instructors</Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 mt-1 font-medium">
            Track teaching availability, scheduling preferences, allocated course divisions, and potential conflicts.
          </p>
        </div>

        {!isStudent && (
          <Button
            variant="primary"
            size="sm"
            onClick={handleOpenAddModal}
            icon={<Plus className="w-4 h-4" />}
          >
            Add Faculty Member
          </Button>
        )}
      </div>

      {/* Filters Card */}
      <Card padding="sm" className="space-y-3">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by ID, name, email, or course..."
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
              className="py-1.5 text-xs w-40"
            />

            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
                { value: 'all', label: 'All Statuses' },
                { value: 'active', label: 'Active' },
                { value: 'on-leave', label: 'On Leave' },
                { value: 'part-time', label: 'Part-Time' },
              ]}
              className="py-1.5 text-xs w-36"
            />

            <Select
              value={buildingPrefFilter}
              onChange={(e) => setBuildingPrefFilter(e.target.value)}
              options={[
                { value: 'all', label: 'All Preferred Buildings' },
                { value: 'Block A', label: 'Block A' },
                { value: 'Block B', label: 'Block B' },
                { value: 'Block D', label: 'Block D' },
              ]}
              className="py-1.5 text-xs w-44"
            />
          </div>
        </div>
      </Card>

      {/* Faculty Table / Directory View */}
      {filteredFaculty.length === 0 ? (
        <EmptyState
          icon={<Users className="w-6 h-6" />}
          title="No Faculty Found"
          description="No faculty members match your filter criteria."
        />
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-100 dark:bg-slate-800 border-b-2 border-slate-300 dark:border-slate-600 font-bold uppercase tracking-widest text-[11px]">
                <tr>
                  <th className="px-4 py-3.5 text-blue-700 dark:text-cyan-300">Faculty ID & Name</th>
                  <th className="px-4 py-3.5 text-indigo-700 dark:text-indigo-300">Department</th>
                  <th className="px-4 py-3.5 text-emerald-700 dark:text-emerald-300">Availability</th>
                  <th className="px-4 py-3.5 text-amber-700 dark:text-amber-300">Preferred Time</th>
                  <th className="px-4 py-3.5 text-violet-700 dark:text-violet-300">Preferred Building</th>
                  <th className="px-4 py-3.5 text-sky-700 dark:text-sky-300">Assigned Classes</th>
                  <th className="px-4 py-3.5 text-pink-700 dark:text-pink-300">Workload / Quota</th>
                  <th className="px-4 py-3.5 text-right text-slate-700 dark:text-slate-200">Profile</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {filteredFaculty.map((faculty) => {
                  const isOverloaded = faculty.workload >= faculty.maxWorkload;
                  const hasPotentialConflicts = faculty.potentialConflicts.length > 0;

                  return (
                    <tr
                      key={faculty.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group cursor-pointer"
                      onClick={() => setSelectedFacultyProfile(faculty)}
                    >
                      {/* Faculty ID & Name */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold text-xs">
                            {faculty.name.split(' ').map((n) => n[0]).slice(-2).join('')}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 transition-colors flex items-center gap-1.5">
                              {faculty.name}
                              {hasPotentialConflicts && (
                                <span title="Potential Conflict Detected">
                                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                                </span>
                              )}
                            </p>
                            <span className="text-[11px] font-mono font-bold text-indigo-700 dark:text-indigo-300">
                              {faculty.id} • {faculty.designation}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Department */}
                      <td className="px-4 py-3.5">
                        <span className="text-indigo-700 dark:text-indigo-300 font-semibold text-xs bg-indigo-50 dark:bg-indigo-950/50 px-2 py-0.5 rounded-md border border-indigo-200 dark:border-indigo-800">
                          {faculty.department}
                        </span>
                      </td>

                      {/* Availability */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1">
                          {faculty.availability.map((day) => (
                            <span
                              key={day}
                              className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                            >
                              {day}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Preferred Time */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1 text-amber-700 dark:text-amber-300 font-semibold text-xs">
                          <Clock className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
                          <span>{faculty.preferredTime}</span>
                        </div>
                      </td>

                      {/* Preferred Building */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1 text-violet-700 dark:text-violet-300 font-semibold text-xs">
                          <Building className="w-3.5 h-3.5 text-violet-500 dark:text-violet-400" />
                          <span>{faculty.preferredBuilding}</span>
                        </div>
                      </td>

                      {/* Assigned Classes */}
                      <td className="px-4 py-3.5">
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {faculty.assignedClasses.map((cls, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 font-mono text-[11px] font-semibold text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                            >
                              {cls}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Workload */}
                      <td className="px-4 py-3.5 w-32">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[11px] font-bold">
                            <span className={isOverloaded ? 'text-red-600' : 'text-slate-700 dark:text-slate-300'}>
                              {faculty.workload} / {faculty.maxWorkload} hrs
                            </span>
                          </div>
                          <ProgressBar
                            value={faculty.workload}
                            max={faculty.maxWorkload}
                            size="sm"
                            color={isOverloaded ? 'bg-red-500' : undefined}
                          />
                        </div>
                      </td>

                      {/* Profile Button */}
                      <td className="px-4 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedFacultyProfile(faculty)}
                          icon={<Eye className="w-3.5 h-3.5 text-blue-600" />}
                        >
                          Profile View
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Faculty Profile View Modal (Section 9 Requirement) */}
      {selectedFacultyProfile && (
        <Modal
          open={!!selectedFacultyProfile}
          onClose={() => setSelectedFacultyProfile(null)}
          title={`Faculty Profile: ${selectedFacultyProfile.name}`}
          description={`${selectedFacultyProfile.designation} • Department of ${selectedFacultyProfile.department}`}
          size="lg"
          footer={
            <div className="flex items-center justify-between w-full">
              <span className="text-xs text-slate-500">
                Contact: {selectedFacultyProfile.email} • {selectedFacultyProfile.phone}
              </span>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setSelectedFacultyProfile(null)}
              >
                Close Profile
              </Button>
            </div>
          }
        >
          <div className="space-y-5 text-xs">
            {/* Top Stat Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                <span className="text-[11px] text-blue-700 dark:text-blue-300 font-bold uppercase tracking-wider">Teaching Workload</span>
                <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  {selectedFacultyProfile.workload} / {selectedFacultyProfile.maxWorkload} hrs/wk
                </p>
                <ProgressBar
                  value={selectedFacultyProfile.workload}
                  max={selectedFacultyProfile.maxWorkload}
                  size="sm"
                  className="mt-1"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                <span className="text-[11px] text-emerald-700 dark:text-emerald-300 font-bold uppercase tracking-wider">Preferred Time Slot</span>
                <p className="text-sm font-bold text-blue-600 dark:text-blue-400 mt-1 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {selectedFacultyProfile.preferredTime}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                <span className="text-[11px] text-violet-700 dark:text-violet-300 font-bold uppercase tracking-wider">Preferred Campus Wing</span>
                <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5" />
                  {selectedFacultyProfile.preferredBuilding}
                </p>
              </div>
            </div>

            {/* Availability Days */}
            <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5">
              <span className="text-[11px] text-slate-800 dark:text-slate-200 font-bold uppercase tracking-wider">
                Weekly Availability Profile
              </span>
              <div className="flex items-center gap-2">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => {
                  const isAvail = selectedFacultyProfile.availability.includes(d);
                  return (
                    <span
                      key={d}
                      className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                        isAvail
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 line-through'
                      }`}
                    >
                      {d}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Potential Conflicts Section */}
            {selectedFacultyProfile.potentialConflicts.length > 0 ? (
              <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 space-y-2">
                <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200 font-bold">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Potential Conflicts & Scheduling Warnings ({selectedFacultyProfile.potentialConflicts.length})</span>
                </div>
                <ul className="list-disc pl-5 space-y-1 text-amber-800 dark:text-amber-300">
                  {selectedFacultyProfile.potentialConflicts.map((conf, idx) => (
                    <li key={idx}>{conf}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>No scheduling or workload conflicts detected for this instructor.</span>
              </div>
            )}

            {/* Faculty Timetable Schedule */}
            <div className="space-y-2">
              <span className="text-xs text-indigo-600 dark:text-cyan-400 font-bold uppercase tracking-wider">
                Allocated Weekly Lecture & Lab Slots ({selectedFacultyProfile.schedule.length})
              </span>
              {selectedFacultyProfile.schedule.length > 0 ? (
                <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-xl">
                  <table className="w-full text-left">
                    <thead className="bg-slate-100 dark:bg-slate-800 border-b-2 border-slate-300 dark:border-slate-600 font-bold uppercase tracking-widest text-[11px]">
                      <tr>
                        <th className="px-3.5 py-2.5 text-blue-700 dark:text-cyan-300">Day</th>
                        <th className="px-3.5 py-2.5 text-amber-700 dark:text-amber-300">Time Slot</th>
                        <th className="px-3.5 py-2.5 text-indigo-700 dark:text-indigo-300">Course Code & Name</th>
                        <th className="px-3.5 py-2.5 text-violet-700 dark:text-violet-300">Cohort</th>
                        <th className="px-3.5 py-2.5 text-emerald-700 dark:text-emerald-300">Assigned Venue</th>
                        <th className="px-3.5 py-2.5 text-sky-700 dark:text-sky-300">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {selectedFacultyProfile.schedule.map((s) => (
                        <tr key={s.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                          <td className="px-3.5 py-2.5 font-bold text-slate-900 dark:text-white">{s.day}</td>
                          <td className="px-3.5 py-2.5 font-mono font-semibold text-amber-600 dark:text-amber-300">{s.startTime} - {s.endTime}</td>
                          <td className="px-3.5 py-2.5 font-semibold text-blue-700 dark:text-cyan-300">{s.courseCode}: {s.course}</td>
                          <td className="px-3.5 py-2.5 font-mono font-medium text-violet-700 dark:text-violet-300">Yr {s.year} • {s.division}</td>
                          <td className="px-3.5 py-2.5 font-mono font-bold text-emerald-700 dark:text-emerald-300">{s.room}</td>
                          <td className="px-3.5 py-2.5">
                            {s.isConflict ? (
                              <Badge variant="error">Conflict</Badge>
                            ) : (
                              <Badge variant="success">Confirmed</Badge>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-slate-700 dark:text-slate-300 italic font-medium p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                  No individual slots allocated yet.
                </p>
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* Add Faculty Modal */}
      {isAddModalOpen && (
        <Modal
          open={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Register New Faculty Member"
          description="Configure instructor profile, weekly availability, and building preferences."
          size="md"
          footer={
            <>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsAddModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleSaveFaculty}
              >
                Create Profile
              </Button>
            </>
          }
        >
          <form onSubmit={handleSaveFaculty} className="space-y-4">
            <Input
              label="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Dr. Ramesh Gupta"
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="ramesh.gupta@campus.edu"
                required
              />
              <Input
                label="Contact Number"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 98765 00000"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
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
                label="Designation"
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                options={[
                  { value: 'Professor', label: 'Professor' },
                  { value: 'Associate Professor', label: 'Associate Professor' },
                  { value: 'Assistant Professor', label: 'Assistant Professor' },
                ]}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Preferred Time Window"
                value={formData.preferredTime}
                onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                options={[
                  { value: 'Morning (09:00 - 13:00)', label: 'Morning (09:00 - 13:00)' },
                  { value: 'Afternoon (13:00 - 17:00)', label: 'Afternoon (13:00 - 17:00)' },
                  { value: 'Flexible', label: 'Flexible' },
                ]}
              />
              <Select
                label="Preferred Campus Wing / Block"
                value={formData.preferredBuilding}
                onChange={(e) => setFormData({ ...formData, preferredBuilding: e.target.value })}
                options={[
                  { value: 'Block A', label: 'Block A (Computer Science)' },
                  { value: 'Block B', label: 'Block B (Natural Sciences)' },
                  { value: 'Block C', label: 'Block C (Seminar Wings)' },
                  { value: 'Block D', label: 'Block D (Auditoriums)' },
                ]}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Available Days (comma separated)"
                value={formData.availability}
                onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                placeholder="Mon, Tue, Wed, Thu, Fri"
                required
              />
              <Input
                label="Assigned Classes (comma separated)"
                value={formData.assignedClasses}
                onChange={(e) => setFormData({ ...formData, assignedClasses: e.target.value })}
                placeholder="CS201 (Div A), CS351 (Div B)"
                required
              />
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default FacultyPage;
