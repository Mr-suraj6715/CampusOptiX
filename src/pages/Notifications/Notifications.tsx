import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Info,
  Sparkles,
  Wrench,
  Trash2,
  Check,
  Filter,
  ArrowRight,
  Clock,
  ShieldAlert,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Tabs } from '@/components/ui/Tabs';
import { EmptyState } from '@/components/shared/EmptyState';

export type NotificationType = 'Critical' | 'Information';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  timeAgo: string;
  actionLabel?: string;
  actionRoute?: string;
}

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'NOTIF-1',
    title: 'Room Allocation Applied',
    message: 'DBMS Lab moved from B204 to A201.',
    type: 'Information',
    read: false,
    timeAgo: '5m ago',
    actionLabel: 'View Room A201',
    actionRoute: '/rooms/R001',
  },
  {
    id: 'NOTIF-2',
    title: 'Facility Offline',
    message: 'Room A102 is under maintenance.',
    type: 'Critical',
    read: false,
    timeAgo: '18m ago',
    actionLabel: 'Emergency Reallocate',
    actionRoute: '/emergency',
  },
  {
    id: 'NOTIF-3',
    title: 'Capacity Overload Alert',
    message: 'New capacity conflict detected.',
    type: 'Critical',
    read: false,
    timeAgo: '45m ago',
    actionLabel: 'Resolve in Conflicts',
    actionRoute: '/conflicts',
  },
  {
    id: 'NOTIF-4',
    title: 'Heuristic Engine Run',
    message: 'Optimization completed.',
    type: 'Information',
    read: true,
    timeAgo: '2h ago',
    actionLabel: 'View Diff Plan',
    actionRoute: '/optimizer',
  },
  {
    id: 'NOTIF-5',
    title: 'Campus Utilization Surge',
    message: 'Campus utilization reached 88% peak during 10:00 - 11:00 AM window.',
    type: 'Information',
    read: true,
    timeAgo: '4h ago',
    actionLabel: 'View Analytics',
    actionRoute: '/analytics',
  },
  {
    id: 'NOTIF-6',
    title: 'AV Hardware Fault',
    message: 'Projector in Room E201 marked faulty by instructor.',
    type: 'Critical',
    read: false,
    timeAgo: '5h ago',
    actionLabel: 'Report Equipment',
    actionRoute: '/rooms/R005',
  },
];

export const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [filterTab, setFilterTab] = useState<string>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filter conditions: all, unread, read, critical, information
  const filteredList = notifications.filter((item) => {
    if (filterTab === 'unread') return !item.read;
    if (filterTab === 'read') return item.read;
    if (filterTab === 'critical') return item.type === 'Critical';
    if (filterTab === 'information') return item.type === 'Information';
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;
  const criticalCount = notifications.filter((n) => n.type === 'Critical').length;
  const infoCount = notifications.filter((n) => n.type === 'Information').length;

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setToastMessage('All notifications marked as read.');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleDelete = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleClearAll = () => {
    setNotifications([]);
    setToastMessage('Notification center cleared.');
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
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
              Notification & Alert Center
            </h1>
            {unreadCount > 0 && <Badge variant="error">{unreadCount} Unread</Badge>}
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time notifications for timetable moves, maintenance states, capacity conflicts, and optimizer outputs.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleMarkAllAsRead}
            disabled={unreadCount === 0}
            icon={<Check className="w-4 h-4" />}
          >
            Mark All Read
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearAll}
            disabled={notifications.length === 0}
            icon={<Trash2 className="w-4 h-4 text-red-500" />}
          >
            Clear All
          </Button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 20. FILTERS: Unread, Read, Critical, Information */}
      {/* ========================================================================= */}
      <Card padding="sm">
        <Tabs
          tabs={[
            { id: 'all', label: 'All Alerts', count: notifications.length },
            { id: 'unread', label: 'Unread', count: unreadCount },
            { id: 'read', label: 'Read' },
            { id: 'critical', label: 'Critical Alerts', count: criticalCount },
            { id: 'information', label: 'Information', count: infoCount },
          ]}
          activeTab={filterTab}
          onChange={setFilterTab}
          variant="pills"
        />
      </Card>

      {/* Notifications List (Matching exact examples from prompt) */}
      {filteredList.length === 0 ? (
        <EmptyState
          icon={<Bell className="w-6 h-6" />}
          title="No Notifications"
          description="You're all caught up! No notifications match your selected filter."
        />
      ) : (
        <div className="space-y-3">
          {filteredList.map((item) => (
            <Card
              key={item.id}
              padding="md"
              hoverEffect
              onClick={() => handleMarkAsRead(item.id)}
              className={`transition-all border-l-4 ${
                !item.read
                  ? 'bg-blue-50/20 dark:bg-blue-950/20 shadow-xs'
                  : 'bg-white dark:bg-slate-900 opacity-80'
              } ${
                item.type === 'Critical'
                  ? 'border-l-red-600'
                  : 'border-l-blue-600'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div
                    className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                      item.type === 'Critical'
                        ? 'bg-red-100 text-red-700 dark:bg-red-950/80 dark:text-red-300'
                        : 'bg-blue-100 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300'
                    }`}
                  >
                    {item.type === 'Critical' ? (
                      <AlertTriangle className="w-4 h-4" />
                    ) : (
                      <Info className="w-4 h-4" />
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                        {item.title}
                      </h3>
                      {!item.read && <Badge variant="error">New</Badge>}
                      <Badge variant={item.type === 'Critical' ? 'error' : 'info'}>
                        {item.type}
                      </Badge>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium">
                      "{item.message}"
                    </p>

                    <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {item.timeAgo}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  {item.actionLabel && item.actionRoute && (
                    <Button
                      variant={item.type === 'Critical' ? 'danger' : 'primary'}
                      size="sm"
                      onClick={() => {
                        handleMarkAsRead(item.id);
                        navigate(item.actionRoute!);
                      }}
                      icon={<ArrowRight className="w-3.5 h-3.5" />}
                    >
                      {item.actionLabel}
                    </Button>
                  )}

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Dismiss"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
