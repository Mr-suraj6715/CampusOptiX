import React, { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  DoorOpen,
  Plus,
  Filter,
  ArrowUpDown,
  Eye,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Building,
  Layers,
  Users,
  Search,
  Sparkles,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { SearchBar } from '@/components/shared/SearchBar';
import { EmptyState } from '@/components/shared/EmptyState';
import { RoomStatusBadge } from '@/components/shared/StatusBadge';
import { mockRooms } from '@/data/mockData';
import type { Room, RoomStatus, RoomType } from '@/types';
import { formatPercent, getUtilizationColor } from '@/utils/cn';
import { useAuth } from '@/context/AuthContext';

export const Rooms = () => {
  const { user } = useAuth();
  const isStudent = user?.role === 'STUDENT';
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Search & Filter state
  const initialSearch = searchParams.get('search') || '';
  const initialStatus = searchParams.get('status') || 'all';

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const [buildingFilter, setBuildingFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'name' | 'capacity' | 'utilization' | 'id'>('utilization');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Rooms Data State
  const [roomsList, setRoomsList] = useState<Room[]>(mockRooms);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [deleteConfirmRoom, setDeleteConfirmRoom] = useState<Room | null>(null);

  // Form State for Add / Edit
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    building: 'Block A',
    floor: 1,
    capacity: 60,
    type: 'classroom' as RoomType,
    status: 'available' as RoomStatus,
    amenities: 'Wi-Fi, AC, Projector',
  });

  // Filtered & Sorted Rooms
  const filteredRooms = useMemo(() => {
    return roomsList
      .filter((room) => {
        const matchesSearch =
          room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          room.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          room.building.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (room.currentClass && room.currentClass.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesStatus = statusFilter === 'all' || room.status === statusFilter;
        const matchesBuilding = buildingFilter === 'all' || room.building === buildingFilter;
        const matchesType = typeFilter === 'all' || room.type === typeFilter;

        return matchesSearch && matchesStatus && matchesBuilding && matchesType;
      })
      .sort((a, b) => {
        let valA = a[sortBy];
        let valB = b[sortBy];
        if (typeof valA === 'string') valA = (valA as string).toLowerCase();
        if (typeof valB === 'string') valB = (valB as string).toLowerCase();

        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
  }, [roomsList, searchQuery, statusFilter, buildingFilter, typeFilter, sortBy, sortOrder]);

  const handleOpenAddModal = () => {
    setFormData({
      id: `R00${roomsList.length + 1}`,
      name: `Room ${String.fromCharCode(65 + roomsList.length)}${roomsList.length + 1}01`,
      building: 'Block A',
      floor: 1,
      capacity: 60,
      type: 'classroom',
      status: 'available',
      amenities: 'Wi-Fi, AC, Projector',
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (room: Room) => {
    setEditingRoom(room);
    setFormData({
      id: room.id,
      name: room.name,
      building: room.building,
      floor: room.floor,
      capacity: room.capacity,
      type: room.type,
      status: room.status,
      amenities: room.amenities.join(', '),
    });
  };

  const handleSaveRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingRoom) {
      // Edit existing
      setRoomsList((prev) =>
        prev.map((r) =>
          r.id === editingRoom.id
            ? {
                ...r,
                name: formData.name,
                building: formData.building,
                floor: Number(formData.floor),
                capacity: Number(formData.capacity),
                type: formData.type,
                status: formData.status,
                amenities: formData.amenities.split(',').map((s) => s.trim()),
              }
            : r
        )
      );
      setEditingRoom(null);
    } else {
      // Add new
      const newRoom: Room = {
        id: formData.id,
        name: formData.name,
        building: formData.building,
        floor: Number(formData.floor),
        capacity: Number(formData.capacity),
        type: formData.type,
        status: formData.status,
        utilization: 0,
        equipment: [
          { id: 'E1', name: 'Projector', count: 1, status: 'working' },
          { id: 'E2', name: 'Whiteboard', count: 1, status: 'working' },
        ],
        amenities: formData.amenities.split(',').map((s) => s.trim()),
        schedule: [],
      };
      setRoomsList((prev) => [newRoom, ...prev]);
      setIsAddModalOpen(false);
    }
  };

  const handleDeleteRoom = () => {
    if (!deleteConfirmRoom) return;
    setRoomsList((prev) => prev.filter((r) => r.id !== deleteConfirmRoom.id));
    setDeleteConfirmRoom(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 via-cyan-600 to-indigo-600 dark:from-blue-400 dark:via-cyan-300 dark:to-indigo-300 bg-clip-text text-transparent">
              Rooms Directory
            </h1>
            <Badge variant="info">{filteredRooms.length} of {roomsList.length} Total</Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 mt-1 font-medium">
            Manage, configure, and monitor all campus lecture halls, classrooms, and seminar rooms.
          </p>
        </div>

        {!isStudent && (
          <Button
            variant="primary"
            size="sm"
            onClick={handleOpenAddModal}
            icon={<Plus className="w-4 h-4" />}
          >
            Add Room
          </Button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <Card padding="sm" className="space-y-3">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by ID, name, building or class..."
            className="max-w-md w-full"
          />

          <div className="flex flex-wrap items-center gap-2.5">
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
                { value: 'all', label: 'All Statuses' },
                { value: 'available', label: 'Available' },
                { value: 'occupied', label: 'Occupied' },
                { value: 'reserved', label: 'Reserved' },
                { value: 'maintenance', label: 'Maintenance' },
                { value: 'underutilized', label: 'Underutilized' },
                { value: 'overcrowded', label: 'Overcrowded' },
              ]}
              className="py-1.5 text-xs w-36"
            />

            <Select
              value={buildingFilter}
              onChange={(e) => setBuildingFilter(e.target.value)}
              options={[
                { value: 'all', label: 'All Buildings' },
                { value: 'Block A', label: 'Block A' },
                { value: 'Block B', label: 'Block B' },
                { value: 'Block C', label: 'Block C' },
                { value: 'Block D', label: 'Block D' },
                { value: 'Block E', label: 'Block E' },
                { value: 'Block F', label: 'Block F' },
                { value: 'Block G', label: 'Block G' },
                { value: 'Block H', label: 'Block H' },
              ]}
              className="py-1.5 text-xs w-36"
            />

            <Select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              options={[
                { value: 'all', label: 'All Types' },
                { value: 'classroom', label: 'Classroom' },
                { value: 'lecture-hall', label: 'Lecture Hall' },
                { value: 'seminar', label: 'Seminar Room' },
              ]}
              className="py-1.5 text-xs w-36"
            />

            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                options={[
                  { value: 'utilization', label: 'Sort by Utilization' },
                  { value: 'capacity', label: 'Sort by Capacity' },
                  { value: 'name', label: 'Sort by Name' },
                  { value: 'id', label: 'Sort by ID' },
                ]}
                className="py-1 text-xs bg-transparent border-0 w-36"
              />
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="p-1 rounded text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
              >
                <ArrowUpDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* Rooms Table */}
      {filteredRooms.length === 0 ? (
        <EmptyState
          icon={<DoorOpen className="w-6 h-6" />}
          title="No Rooms Found"
          description="No rooms match your filter criteria. Try resetting the filters or add a new room."
          actionLabel="Reset Filters"
          onAction={() => {
            setSearchQuery('');
            setStatusFilter('all');
            setBuildingFilter('all');
            setTypeFilter('all');
          }}
        />
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-100 dark:bg-slate-800 border-b-2 border-slate-300 dark:border-slate-600 font-bold uppercase tracking-widest text-[11px]">
                <tr>
                  <th className="px-4 py-3.5 text-blue-700 dark:text-cyan-300 min-w-[200px] w-[22%]">Room Info</th>
                  <th className="px-4 py-3.5 text-indigo-700 dark:text-indigo-300 whitespace-nowrap min-w-[130px] w-[12%]">Location</th>
                  <th className="px-4 py-3.5 text-violet-700 dark:text-violet-300 whitespace-nowrap min-w-[110px] w-[10%]">Capacity</th>
                  <th className="px-4 py-3.5 text-purple-700 dark:text-purple-300 whitespace-nowrap min-w-[120px] w-[11%]">Type</th>
                  <th className="px-4 py-3.5 text-emerald-700 dark:text-emerald-300 whitespace-nowrap min-w-[110px] w-[11%]">Status</th>
                  <th className="px-4 py-3.5 text-amber-700 dark:text-amber-300 whitespace-nowrap min-w-[140px] w-[14%]">Utilization</th>
                  <th className="px-4 py-3.5 text-sky-700 dark:text-sky-300 min-w-[180px] w-[15%]">Current Activity</th>
                  <th className="px-4 py-3.5 text-right text-slate-700 dark:text-slate-200 whitespace-nowrap min-w-[90px] w-[5%]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {filteredRooms.map((room) => (
                  <tr
                    key={room.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group cursor-pointer"
                    onClick={() => navigate(`/rooms/${room.id}`)}
                  >
                    {/* Room ID & Name */}
                    <td className="px-4 py-3.5 align-middle">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-mono font-bold text-xs shrink-0">
                          {room.id}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors whitespace-nowrap">
                            {room.name}
                          </p>
                          <p className="text-[11px] text-violet-700 dark:text-violet-300 font-mono font-medium whitespace-nowrap">
                            {room.amenities.slice(0, 2).join(' • ')}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Location */}
                    <td className="px-4 py-3.5 align-middle whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-indigo-700 dark:text-indigo-300 font-medium">
                        <Building className="w-3.5 h-3.5 text-indigo-400 dark:text-indigo-400 shrink-0" />
                        <span className="whitespace-nowrap">{room.building}, Fl {room.floor}</span>
                      </div>
                    </td>

                    {/* Capacity */}
                    <td className="px-4 py-3.5 align-middle whitespace-nowrap">
                      <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-slate-100">
                        <Users className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                        <span className="whitespace-nowrap">{room.capacity} seats</span>
                      </div>
                    </td>

                    {/* Type */}
                    <td className="px-4 py-3.5 align-middle whitespace-nowrap">
                      <span className="inline-block capitalize text-purple-700 dark:text-purple-300 font-semibold text-xs bg-purple-50 dark:bg-purple-950/50 px-2.5 py-1 rounded-md border border-purple-200 dark:border-purple-800 whitespace-nowrap">
                        {room.type.replace('-', ' ')}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3.5 align-middle whitespace-nowrap">
                      <RoomStatusBadge status={room.status} />
                    </td>

                    {/* Utilization */}
                    <td className="px-4 py-3.5 align-middle whitespace-nowrap">
                      <div className="space-y-1 w-36">
                        <ProgressBar value={room.utilization} size="sm" />
                        <span className={`text-[11px] font-bold ${getUtilizationColor(room.utilization)}`}>
                          {formatPercent(room.utilization)}
                        </span>
                      </div>
                    </td>

                    {/* Current Activity */}
                    <td className="px-4 py-3.5 align-middle text-xs">
                      {room.currentClass ? (
                        <div className="max-w-xs">
                          <p className="font-semibold text-sky-800 dark:text-sky-200 truncate">
                            {room.currentClass}
                          </p>
                          <p className="text-[11px] text-sky-600 dark:text-sky-400 truncate">
                            {room.currentFaculty}
                          </p>
                        </div>
                      ) : (
                        <span className="text-slate-700 dark:text-slate-300 italic font-medium whitespace-nowrap">No class active</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3.5 align-middle text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => navigate(`/rooms/${room.id}`)}
                          className="p-1.5 text-blue-500 dark:text-blue-400 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/60 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {!isStudent && (
                          <>
                            <button
                              onClick={() => handleOpenEditModal(room)}
                              className="p-1.5 text-slate-500 dark:text-slate-300 hover:text-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                              title="Edit Room"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirmRoom(room)}
                              className="p-1.5 text-red-400 dark:text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/60 rounded-lg transition-colors"
                              title="Delete Room"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Room Modal */}
      {(isAddModalOpen || editingRoom) && (
        <Modal
          open={isAddModalOpen || !!editingRoom}
          onClose={() => {
            setIsAddModalOpen(false);
            setEditingRoom(null);
          }}
          title={editingRoom ? `Edit Room ${editingRoom.name}` : 'Add New Campus Room'}
          description="Configure room properties, seating capacity, and default status."
          size="md"
          footer={
            <>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingRoom(null);
                }}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleSaveRoom}
              >
                {editingRoom ? 'Save Changes' : 'Create Room'}
              </Button>
            </>
          }
        >
          <form onSubmit={handleSaveRoom} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Room ID"
                value={formData.id}
                onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                required
                disabled={!!editingRoom}
              />
              <Input
                label="Room Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Room A101"
                required
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
                  { value: 'Block F', label: 'Block F' },
                  { value: 'Block G', label: 'Block G' },
                  { value: 'Block H', label: 'Block H' },
                ]}
              />
              <Input
                label="Floor Number"
                type="number"
                min={0}
                max={10}
                value={formData.floor}
                onChange={(e) => setFormData({ ...formData, floor: Number(e.target.value) })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Capacity (Seats)"
                type="number"
                min={10}
                max={500}
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                required
              />
              <Select
                label="Room Type"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as RoomType })}
                options={[
                  { value: 'classroom', label: 'Classroom' },
                  { value: 'lecture-hall', label: 'Lecture Hall' },
                  { value: 'seminar', label: 'Seminar Room' },
                  { value: 'conference', label: 'Conference Room' },
                ]}
              />
            </div>

            <Select
              label="Current Status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as RoomStatus })}
              options={[
                { value: 'available', label: 'Available' },
                { value: 'occupied', label: 'Occupied' },
                { value: 'reserved', label: 'Reserved' },
                { value: 'maintenance', label: 'Maintenance' },
                { value: 'underutilized', label: 'Underutilized' },
                { value: 'overcrowded', label: 'Overcrowded' },
              ]}
            />

            <Input
              label="Amenities & Equipment (comma separated)"
              value={formData.amenities}
              onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
              placeholder="e.g. Wi-Fi, AC, Projector, Smart Board"
            />
          </form>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmRoom && (
        <Modal
          open={!!deleteConfirmRoom}
          onClose={() => setDeleteConfirmRoom(null)}
          title="Delete Room"
          size="sm"
          footer={
            <>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setDeleteConfirmRoom(null)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleDeleteRoom}
              >
                Delete Room
              </Button>
            </>
          }
        >
          <div className="space-y-3">
            <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
              Are you sure you want to remove <strong className="text-slate-950 dark:text-white font-bold">{deleteConfirmRoom.name} ({deleteConfirmRoom.id})</strong>?
            </p>
            <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-lg text-xs text-red-800 dark:text-red-300">
              Warning: Any scheduled classes assigned to this room will need to be reallocated.
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Rooms;
