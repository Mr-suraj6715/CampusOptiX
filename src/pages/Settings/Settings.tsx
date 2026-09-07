import React, { useState } from 'react';
import {
  Sliders,
  Bell,
  Globe,
  SlidersHorizontal,
  CheckCircle2,
  Save,
  RotateCcw,
  Zap,
  Shield,
  Clock,
  Building,
  Users,
  Code2,
  Layers,
  Database,
  Key,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Tabs } from '@/components/ui/Tabs';
import { useTheme } from '@/context/ThemeContext';

export const Settings = () => {
  const { isDark, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('general');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // 1. General Settings
  const [generalSettings, setGeneralSettings] = useState({
    campusName: 'Global Institute of Technology & Management',
    academicTerm: 'Autumn Term 2026-27',
    operatingHoursStart: '08:00 AM',
    operatingHoursEnd: '06:00 PM',
    weekStartsOn: 'Monday',
    defaultTimezone: 'Asia/Kolkata (IST)',
  });

  // 2. Optimization Weights (Section 22 Requirements)
  const [optWeights, setOptWeights] = useState({
    capacity: 90,
    equipment: 85,
    availability: 95,
    roomType: 80,
    utilization: 75,
    facultyPreference: 65,
    studentTravel: 60,
  });

  // 3. Utilization Thresholds (Section 22 Requirements)
  const [thresholds, setThresholds] = useState({
    underutilizationThreshold: 40,
    overcrowdingThreshold: 90,
    peakHourAlertCapacity: 85,
    minBufferMinutes: 10,
  });

  // 4. Notifications
  const [notificationRules, setNotificationRules] = useState({
    emailAlertsOnCritical: true,
    smsAlertsEmergency: true,
    pushNotificationFaculty: true,
    dailyDigestSummary: true,
  });

  // 5. User Preferences
  const [userPrefs, setUserPrefs] = useState({
    tableDensity: 'compact',
    defaultLandingView: 'Dashboard',
    timeFormat: '12h',
    soundEffects: false,
  });

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();
    setToastMessage('System configurations and AI heuristic weights saved successfully!');
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleResetWeights = () => {
    setOptWeights({
      capacity: 90,
      equipment: 85,
      availability: 95,
      roomType: 80,
      utilization: 75,
      facultyPreference: 65,
      studentTravel: 60,
    });
    setToastMessage('Optimization weights reset to recommended defaults.');
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Toast Notification */}
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
            <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 dark:from-cyan-300 dark:via-blue-300 dark:to-indigo-300 bg-clip-text text-transparent">
              System Settings & Heuristic Tuning
            </h1>
            <Badge variant="info">Admin Configuration</Badge>
          </div>
          <p className="text-xs sm:text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Configure campus operating hours, AI heuristic optimization weights, anomaly thresholds, and user preferences.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={handleSaveAll}
          icon={<Save className="w-4 h-4" />}
        >
          Save All Changes
        </Button>
      </div>

      {/* Settings Navigation Tabs (Section 22 Requirements) */}
      <Card padding="sm">
        <Tabs
          tabs={[
            { id: 'general', label: 'General' },
            { id: 'optimization-weights', label: 'Optimization Weights' },
            { id: 'utilization-thresholds', label: 'Utilization Thresholds' },
            { id: 'notifications', label: 'Notifications' },
            { id: 'user-preferences', label: 'User Preferences' },
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
          variant="pills"
        />
      </Card>

      {/* ========================================================================= */}
      {/* 1. GENERAL SETTINGS */}
      {/* ========================================================================= */}
      {activeTab === 'general' && (
        <Card padding="md" className="space-y-4">
          <CardHeader>
            <div>
              <CardTitle>General Campus Profile</CardTitle>
              <CardDescription>Institution metadata and default academic hours</CardDescription>
            </div>
            <Globe className="w-4 h-4 text-blue-600" />
          </CardHeader>

          <form onSubmit={handleSaveAll} className="space-y-4 text-xs sm:text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Institution Name"
                value={generalSettings.campusName}
                onChange={(e) => setGeneralSettings({ ...generalSettings, campusName: e.target.value })}
                required
              />
              <Input
                label="Current Academic Term"
                value={generalSettings.academicTerm}
                onChange={(e) => setGeneralSettings({ ...generalSettings, academicTerm: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Select
                label="Operating Start Time"
                value={generalSettings.operatingHoursStart}
                onChange={(e) => setGeneralSettings({ ...generalSettings, operatingHoursStart: e.target.value })}
                options={[
                  { value: '07:30 AM', label: '07:30 AM' },
                  { value: '08:00 AM', label: '08:00 AM' },
                  { value: '08:30 AM', label: '08:30 AM' },
                ]}
              />

              <Select
                label="Operating End Time"
                value={generalSettings.operatingHoursEnd}
                onChange={(e) => setGeneralSettings({ ...generalSettings, operatingHoursEnd: e.target.value })}
                options={[
                  { value: '05:00 PM', label: '05:00 PM' },
                  { value: '06:00 PM', label: '06:00 PM' },
                  { value: '07:00 PM', label: '07:00 PM' },
                ]}
              />

              <Select
                label="Week Starts On"
                value={generalSettings.weekStartsOn}
                onChange={(e) => setGeneralSettings({ ...generalSettings, weekStartsOn: e.target.value })}
                options={[
                  { value: 'Monday', label: 'Monday' },
                  { value: 'Sunday', label: 'Sunday' },
                ]}
              />
            </div>
          </form>
        </Card>
      )}

      {/* ========================================================================= */}
      {/* 2. OPTIMIZATION WEIGHTS (Sliders UI for Capacity, Equipment, Availability,
          Room Type, Utilization, Faculty Preference, Student Travel) */}
      {/* ========================================================================= */}
      {activeTab === 'optimization-weights' && (
        <Card padding="md" className="space-y-5">
          <CardHeader>
            <div>
              <CardTitle>AI Optimization Heuristic Weights</CardTitle>
              <CardDescription>
                Tune the multi-objective scoring formula used by the solver to rank room candidates
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetWeights}
              icon={<RotateCcw className="w-3.5 h-3.5" />}
            >
              Reset to Defaults
            </Button>
          </CardHeader>

          <div className="space-y-4">
            {/* 1. Capacity */}
            <div className="space-y-1.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-900 dark:text-slate-100">1. Seating Capacity Fit Weight</span>
                <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{optWeights.capacity}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={optWeights.capacity}
                onChange={(e) => setOptWeights({ ...optWeights, capacity: Number(e.target.value) })}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <p className="text-[11px] text-slate-500">Penalizes overcrowding violations and excessive unutilized empty seats.</p>
            </div>

            {/* 2. Equipment */}
            <div className="space-y-1.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-900 dark:text-slate-100">2. Required Equipment Matching</span>
                <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{optWeights.equipment}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={optWeights.equipment}
                onChange={(e) => setOptWeights({ ...optWeights, equipment: Number(e.target.value) })}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <p className="text-[11px] text-slate-500">Ensures specialized lab hardware, projectors, and acoustics are available.</p>
            </div>

            {/* 3. Availability */}
            <div className="space-y-1.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-900 dark:text-slate-100">3. Time Slot Availability</span>
                <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{optWeights.availability}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={optWeights.availability}
                onChange={(e) => setOptWeights({ ...optWeights, availability: Number(e.target.value) })}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <p className="text-[11px] text-slate-500">Hard constraint preventing double-booking overlaps.</p>
            </div>

            {/* 4. Room Type */}
            <div className="space-y-1.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-900 dark:text-slate-100">4. Room Type Compatibility</span>
                <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{optWeights.roomType}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={optWeights.roomType}
                onChange={(e) => setOptWeights({ ...optWeights, roomType: Number(e.target.value) })}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <p className="text-[11px] text-slate-500">Matches classroom vs lab vs seminar hall taxonomy.</p>
            </div>

            {/* 5. Utilization */}
            <div className="space-y-1.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-900 dark:text-slate-100">5. Overall Space Utilization</span>
                <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{optWeights.utilization}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={optWeights.utilization}
                onChange={(e) => setOptWeights({ ...optWeights, utilization: Number(e.target.value) })}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <p className="text-[11px] text-slate-500">Encourages dense schedules in open wings to enable HVAC power down in idle blocks.</p>
            </div>

            {/* 6. Faculty Preference */}
            <div className="space-y-1.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-900 dark:text-slate-100">6. Faculty Schedule & Building Preference</span>
                <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{optWeights.facultyPreference}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={optWeights.facultyPreference}
                onChange={(e) => setOptWeights({ ...optWeights, facultyPreference: Number(e.target.value) })}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <p className="text-[11px] text-slate-500">Respects instructor preferred time windows and home department buildings.</p>
            </div>

            {/* 7. Student Travel */}
            <div className="space-y-1.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-900 dark:text-slate-100">7. Student Travel Distance Minimization</span>
                <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{optWeights.studentTravel}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={optWeights.studentTravel}
                onChange={(e) => setOptWeights({ ...optWeights, studentTravel: Number(e.target.value) })}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <p className="text-[11px] text-slate-500">Minimizes cross-campus walking time between consecutive lecture periods.</p>
            </div>
          </div>
        </Card>
      )}

      {/* ========================================================================= */}
      {/* 3. UTILIZATION THRESHOLDS */}
      {/* ========================================================================= */}
      {activeTab === 'utilization-thresholds' && (
        <Card padding="md" className="space-y-4">
          <CardHeader>
            <div>
              <CardTitle>Capacity & Anomaly Detection Thresholds</CardTitle>
              <CardDescription>Set boundary trigger levels for automated alert generation</CardDescription>
            </div>
          </CardHeader>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
            <Input
              label="Underutilization Alert Ceiling (%)"
              type="number"
              min={10}
              max={60}
              value={thresholds.underutilizationThreshold}
              onChange={(e) => setThresholds({ ...thresholds, underutilizationThreshold: Number(e.target.value) })}
              helperText="Rooms with occupancy below this % will be tagged as Underutilized."
            />

            <Input
              label="Overcrowding Hazard Threshold (%)"
              type="number"
              min={70}
              max={100}
              value={thresholds.overcrowdingThreshold}
              onChange={(e) => setThresholds({ ...thresholds, overcrowdingThreshold: Number(e.target.value) })}
              helperText="Rooms with attendance exceeding this % trigger capacity warnings."
            />

            <Input
              label="Peak Hour Capacity Warning (%)"
              type="number"
              min={50}
              max={95}
              value={thresholds.peakHourAlertCapacity}
              onChange={(e) => setThresholds({ ...thresholds, peakHourAlertCapacity: Number(e.target.value) })}
              helperText="Triggers load shedding recommendations during 10:00 - 12:00."
            />

            <Input
              label="Minimum Transition Buffer (Minutes)"
              type="number"
              min={5}
              max={30}
              value={thresholds.minBufferMinutes}
              onChange={(e) => setThresholds({ ...thresholds, minBufferMinutes: Number(e.target.value) })}
              helperText="Required clean-up buffer between consecutive lab sessions."
            />
          </div>
        </Card>
      )}

      {/* ========================================================================= */}
      {/* 4. NOTIFICATIONS */}
      {/* ========================================================================= */}
      {activeTab === 'notifications' && (
        <Card padding="md" className="space-y-4">
          <CardHeader>
            <div>
              <CardTitle>Alert Dispatch & Push Preferences</CardTitle>
              <CardDescription>Configure communication routes for timetable modifications</CardDescription>
            </div>
            <Bell className="w-4 h-4 text-blue-600" />
          </CardHeader>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900 dark:text-slate-100">Critical Conflict Email Alerts</p>
                <p className="text-slate-500">Dispatch immediate emails to HODs on double-booking anomalies.</p>
              </div>
              <input
                type="checkbox"
                checked={notificationRules.emailAlertsOnCritical}
                onChange={(e) => setNotificationRules({ ...notificationRules, emailAlertsOnCritical: e.target.checked })}
                className="w-4 h-4 accent-blue-600"
              />
            </div>

            <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900 dark:text-slate-100">Emergency SMS Broadcasting</p>
                <p className="text-slate-500">Send high-priority SMS alerts on sudden room unavailability.</p>
              </div>
              <input
                type="checkbox"
                checked={notificationRules.smsAlertsEmergency}
                onChange={(e) => setNotificationRules({ ...notificationRules, smsAlertsEmergency: e.target.checked })}
                className="w-4 h-4 accent-blue-600"
              />
            </div>

            <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900 dark:text-slate-100">Faculty Push Notifications</p>
                <p className="text-slate-500">Send instant companion app alerts on schedule reassignments.</p>
              </div>
              <input
                type="checkbox"
                checked={notificationRules.pushNotificationFaculty}
                onChange={(e) => setNotificationRules({ ...notificationRules, pushNotificationFaculty: e.target.checked })}
                className="w-4 h-4 accent-blue-600"
              />
            </div>
          </div>
        </Card>
      )}

      {/* ========================================================================= */}
      {/* 5. USER PREFERENCES */}
      {/* ========================================================================= */}
      {activeTab === 'user-preferences' && (
        <Card padding="md" className="space-y-4">
          <CardHeader>
            <div>
              <CardTitle>User Interface & Theme Preferences</CardTitle>
              <CardDescription>Tailor dashboard appearance, table densities, and time formatting</CardDescription>
            </div>
          </CardHeader>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900 dark:text-slate-100">Color Theme</p>
                <p className="text-slate-500 text-xs">Switch between Light and Dark interface modes.</p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={toggleTheme}
              >
                {isDark ? '🌙 Dark Mode' : '☀️ Light Mode'}
              </Button>
            </div>

            <Select
              label="Table & Grid Density"
              value={userPrefs.tableDensity}
              onChange={(e) => setUserPrefs({ ...userPrefs, tableDensity: e.target.value })}
              options={[
                { value: 'compact', label: 'Compact (Maximum information)' },
                { value: 'standard', label: 'Standard' },
                { value: 'spacious', label: 'Spacious' },
              ]}
            />

            <Select
              label="Default Home View"
              value={userPrefs.defaultLandingView}
              onChange={(e) => setUserPrefs({ ...userPrefs, defaultLandingView: e.target.value })}
              options={[
                { value: 'Dashboard', label: 'Executive Dashboard' },
                { value: 'Timetable', label: 'Campus Timetable Grid' },
                { value: 'LiveCampus', label: 'Live IoT Telemetry' },
              ]}
            />

            <Select
              label="Time Display Format"
              value={userPrefs.timeFormat}
              onChange={(e) => setUserPrefs({ ...userPrefs, timeFormat: e.target.value })}
              options={[
                { value: '12h', label: '12-Hour (02:00 PM)' },
                { value: '24h', label: '24-Hour (14:00)' },
              ]}
            />
          </div>
        </Card>
      )}
    </div>
  );
};

export default Settings;
