import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FlaskConical,
  Plus,
  ShieldCheck,
  Cpu,
  Building,
  Users,
  Search,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  ArrowUpDown,
  Zap,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { SearchBar } from '@/components/shared/SearchBar';
import { EmptyState } from '@/components/shared/EmptyState';
import { RoomStatusBadge } from '@/components/shared/StatusBadge';
import { mockLabs } from '@/data/mockData';
import type { Lab, RoomStatus } from '@/types';
import { formatPercent, getUtilizationColor } from '@/utils/cn';
import { useAuth } from '@/context/AuthContext';

export const Labs = () => {
  const { user } = useAuth();
  const isStudent = user?.role === 'STUDENT';
  const navigate = useNavigate();
  const [labsList, setLabsList] = useState<Lab[]>(mockLabs);
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [safetyFilter, setSafetyFilter] = useState('all');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    department: 'Computer Science',
    building: 'Block A',
    floor: 0,
    capacity: 35,
    status: 'available' as RoomStatus,
    safetyRating: 'A' as 'A' | 'B' | 'C',
    specialEquipment: 'Workstations, High-Speed LAN, Projector',
  });

  const filteredLabs = useMemo(() => {
    return labsList.filter((lab) => {
      const matchSearch =
        lab.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lab.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lab.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (lab.currentClass && lab.currentClass.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchDept = deptFilter === 'all' || lab.department === deptFilter;
      const matchStatus = statusFilter === 'all' || lab.status === statusFilter;
      const matchSafety = safetyFilter === 'all' || lab.safetyRating === safetyFilter;

      return matchSearch && matchDept && matchStatus && matchSafety;
    });
  }, [labsList, searchQuery, deptFilter, statusFilter, safetyFilter]);

  const handleOpenAddModal = () => {
    setFormData({
      id: `L00${labsList.length + 1}`,
      name: 'AI & Robotics Lab',
      department: 'Computer Science',
      building: 'Block A',
      floor: 1,
      capacity: 35,
      status: 'available',
      safetyRating: 'A',
      specialEquipment: 'GPU Workstations, Robot Arm Kits, 3D Scanner',
    });
    setIsAddModalOpen(true);
  };

  const handleSaveLab = (e: React.FormEvent) => {
    e.preventDefault();
    const newLab: Lab = {
      id: formData.id,
      name: formData.name,
      department: formData.department,
      building: formData.building,
      floor: Number(formData.floor),
      capacity: Number(formData.capacity),
      type: 'computer-lab',
      status: formData.status,
      safetyRating: formData.safetyRating,
      utilization: 0,
      specialEquipment: formData.specialEquipment.split(',').map((s) => s.trim()),
      equipment: [
        { id: 'LE1', name: 'Workstation', count: Number(formData.capacity), status: 'working' },
      ],
      amenities: ['High-Speed Internet', 'AC', 'UPS'],
      schedule: [],
    };
    setLabsList((prev) => [newLab, ...prev]);
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 dark:from-purple-400 dark:via-violet-300 dark:to-indigo-300 bg-clip-text text-transparent">
              Laboratories & Research Facilities
            </h1>
            <Badge variant="purple">{filteredLabs.length} Labs</Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 mt-1 font-medium">
            Specialized computer labs, physics/chemistry facilities, and safety compliance.
          </p>
        </div>

        {!isStudent && (
          <Button
            variant="primary"
            size="sm"
            onClick={handleOpenAddModal}
            icon={<Plus className="w-4 h-4" />}
          >
            Register New Lab
          </Button>
        )}
      </div>

      {/* Filters Card */}
      <Card padding="sm" className="space-y-3">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search labs by name, department, or software..."
            className="max-w-md w-full"
          />

          <div className="flex flex-wrap items-center gap-2.5">
            <Select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              options={[
                { value: 'all', label: 'All Departments' },
                { value: 'Computer Science', label: 'Computer Science' },
                { value: 'Physics', label: 'Physics' },
                { value: 'Chemistry', label: 'Chemistry' },
                { value: 'Electronics', label: 'Electronics' },
                { value: 'Biology', label: 'Biology' },
                { value: 'Mechanical Engineering', label: 'Mechanical Eng' },
              ]}
              className="py-1.5 text-xs w-40"
            />

            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
                { value: 'all', label: 'All Statuses' },
                { value: 'available', label: 'Available' },
                { value: 'occupied', label: 'Occupied' },
                { value: 'overcrowded', label: 'Overcrowded' },
                { value: 'underutilized', label: 'Underutilized' },
              ]}
              className="py-1.5 text-xs w-36"
            />

            <Select
              value={safetyFilter}
              onChange={(e) => setSafetyFilter(e.target.value)}
              options={[
                { value: 'all', label: 'All Safety Ratings' },
                { value: 'A', label: 'Safety Rating A' },
                { value: 'B', label: 'Safety Rating B' },
                { value: 'C', label: 'Safety Rating C' },
              ]}
              className="py-1.5 text-xs w-36"
            />
          </div>
        </div>
      </Card>

      {/* Labs Grid Cards */}
      {filteredLabs.length === 0 ? (
        <EmptyState
          icon={<FlaskConical className="w-6 h-6" />}
          title="No Laboratories Found"
          description="Try adjusting your filter options or add a new laboratory facility."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredLabs.map((lab) => (
            <Card
              key={lab.id}
              padding="md"
              hoverEffect
              onClick={() => navigate(`/rooms/${lab.id}`)}
              className="flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <span className="text-[11px] font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded">
                      {lab.id}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                      {lab.name}
                    </h3>
                    <p className="text-xs font-semibold text-indigo-700 dark:text-indigo-300">
                      {lab.department}
                    </p>
                  </div>
                  <RoomStatusBadge status={lab.status} />
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-slate-700 dark:text-slate-300 pt-1">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Building className="w-3.5 h-3.5 text-indigo-500" />
                    {lab.building}, Fl {lab.floor}
                  </span>
                  <span className="flex items-center gap-1.5 font-medium">
                    <Users className="w-3.5 h-3.5 text-violet-500" />
                    Cap: <strong className="text-slate-900 dark:text-white">{lab.capacity} seats</strong>
                  </span>
                  <span className="flex items-center gap-1.5 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    Safety: <strong className="text-slate-900 dark:text-white">Class {lab.safetyRating}</strong>
                  </span>
                  <span className="flex items-center gap-1.5 font-semibold">
                    Usage: <span className={getUtilizationColor(lab.utilization)}>{formatPercent(lab.utilization)}</span>
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <ProgressBar value={lab.utilization} size="sm" />
                </div>

                {/* Current Active Session */}
                {lab.currentClass && (
                  <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs">
                    <p className="font-bold text-slate-900 dark:text-white truncate">
                      {lab.currentClass}
                    </p>
                    <p className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate mt-0.5">
                      {lab.currentFaculty}
                    </p>
                  </div>
                )}

                {/* Special Equipment Tags */}
                <div className="space-y-1.5 pt-1">
                  <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                    Equipment & Hardware
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {lab.specialEquipment.map((eq, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-semibold text-slate-800 dark:text-slate-200"
                      >
                        {eq}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {lab.equipment.length} Tracked Assets
                </span>
                <span className="font-bold text-blue-600 dark:text-blue-400 group-hover:underline">
                  View Facility Details →
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add Lab Modal */}
      {isAddModalOpen && (
        <Modal
          open={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Register New Laboratory Facility"
          description="Configure laboratory capacity, safety rating, and equipment specifications."
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
                onClick={handleSaveLab}
              >
                Create Lab
              </Button>
            </>
          }
        >
          <form onSubmit={handleSaveLab} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Lab ID"
                value={formData.id}
                onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                required
              />
              <Input
                label="Lab Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                  { value: 'Physics', label: 'Physics' },
                  { value: 'Chemistry', label: 'Chemistry' },
                  { value: 'Electronics', label: 'Electronics' },
                  { value: 'Biology', label: 'Biology' },
                  { value: 'Mechanical Engineering', label: 'Mechanical Eng' },
                ]}
              />
              <Select
                label="Safety Rating"
                value={formData.safetyRating}
                onChange={(e) => setFormData({ ...formData, safetyRating: e.target.value as any })}
                options={[
                  { value: 'A', label: 'Class A (Standard / Computer)' },
                  { value: 'B', label: 'Class B (Chemical / Laser Hazards)' },
                  { value: 'C', label: 'Class C (High Hazard / Heavy Machinery)' },
                ]}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Building"
                value={formData.building}
                onChange={(e) => setFormData({ ...formData, building: e.target.value })}
                options={[
                  { value: 'Block A', label: 'Block A' },
                  { value: 'Block B', label: 'Block B' },
                  { value: 'Block C', label: 'Block C' },
                  { value: 'Block D', label: 'Block D' },
                  { value: 'Block E', label: 'Block E' },
                ]}
              />
              <Input
                label="Capacity (Workstations)"
                type="number"
                min={10}
                max={100}
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                required
              />
            </div>

            <Input
              label="Special Hardware & Equipment (comma separated)"
              value={formData.specialEquipment}
              onChange={(e) => setFormData({ ...formData, specialEquipment: e.target.value })}
              placeholder="e.g. Workstations, Oscilloscopes, GPU Racks"
            />
          </form>
        </Modal>
      )}
    </div>
  );
};

export default Labs;
