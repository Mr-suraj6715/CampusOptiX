import React, { useState } from 'react';
import {
  TrendingUp,
  BarChart2,
  PieChart as PieChartIcon,
  Download,
  Calendar,
  Layers,
  Sparkles,
  Zap,
  Building,
  Users,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Select';
import { KPICard } from '@/components/shared/KPICard';

// Hourly Peak Traffic Line Chart Data
const hourlyTrafficData = [
  { time: '08:00', students: 420, baseline: 350 },
  { time: '09:00', students: 890, baseline: 720 },
  { time: '10:00', students: 1450, baseline: 1100 }, // Peak
  { time: '11:00', students: 1520, baseline: 1150 }, // Peak
  { time: '12:00', students: 680, baseline: 600 },
  { time: '13:00', students: 510, baseline: 450 },
  { time: '14:00', students: 1320, baseline: 1050 },
  { time: '15:00', students: 1180, baseline: 980 },
  { time: '16:00', students: 780, baseline: 650 },
  { time: '17:00', students: 310, baseline: 250 },
];

// Room Utilization by Building (Bar Chart)
const buildingUtilizationData = [
  { name: 'Block A (CS)', before: 72, after: 88 },
  { name: 'Block B (Science)', before: 58, after: 78 },
  { name: 'Block C (Seminar)', before: 34, after: 68 },
  { name: 'Block D (Auditoriums)', before: 84, after: 92 },
  { name: 'Block E (Engineering)', before: 45, after: 74 },
];

// Departmental Space Share (Donut / Pie Chart)
const departmentShareData = [
  { name: 'Computer Science', value: 35, color: '#3b82f6' },
  { name: 'Mechanical Eng', value: 22, color: '#8b5cf6' },
  { name: 'Electronics', value: 18, color: '#06b6d4' },
  { name: 'Natural Sciences', value: 15, color: '#10b981' },
  { name: 'Management', value: 10, color: '#f59e0b' },
];

// Before vs After Optimization Comparison Data
const beforeAfterComparisonData = [
  { metric: 'Capacity Deficit', before: 38, after: 4 },
  { metric: 'Double Bookings', before: 12, after: 0 },
  { metric: 'Idle Hours / Wk', before: 64, after: 18 },
  { metric: 'HVAC Waste (kWh)', before: 85, after: 32 },
  { metric: 'Avg Commute (min)', before: 14, after: 5 },
];

export const Analytics = () => {
  const [timeRange, setTimeRange] = useState('semester');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleExport = () => {
    setToastMessage('Space Utilization & Energy Efficiency Report (PDF/CSV) generated!');
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
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Campus Resource Analytics & Audit
            </h1>
            <Badge variant="info">Telemetry Insights</Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Quantitative space efficiency, peak hourly loads, bottleneck rates, and before-vs-after optimization benchmarks.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            options={[
              { value: 'week', label: 'Current Week' },
              { value: 'month', label: 'Past 30 Days' },
              { value: 'semester', label: 'Current Academic Term' },
            ]}
            className="text-xs py-1.5 w-44"
          />
          <Button
            variant="secondary"
            size="sm"
            onClick={handleExport}
            icon={<Download className="w-4 h-4" />}
          >
            Export Audit
          </Button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 19. ALL 8 REQUIRED METRICS:
          Overall Utilization, Room Utilization, Lab Utilization, Peak Hours,
          Underutilization, Overcrowding, Conflict Rate, Resolution Rate */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {/* 1. Overall Utilization */}
        <Card padding="sm" className="space-y-1">
          <span className="text-[10px] font-semibold text-slate-400 uppercase">Overall Util</span>
          <p className="text-lg font-extrabold text-blue-600 dark:text-blue-400">62%</p>
          <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5">
            <ArrowUpRight className="w-3 h-3" /> +14% QoQ
          </span>
        </Card>

        {/* 2. Room Utilization */}
        <Card padding="sm" className="space-y-1">
          <span className="text-[10px] font-semibold text-slate-400 uppercase">Room Util</span>
          <p className="text-lg font-extrabold text-slate-900 dark:text-slate-100">68%</p>
          <span className="text-[10px] text-slate-400">24 Classrooms</span>
        </Card>

        {/* 3. Lab Utilization */}
        <Card padding="sm" className="space-y-1">
          <span className="text-[10px] font-semibold text-slate-400 uppercase">Lab Util</span>
          <p className="text-lg font-extrabold text-purple-600 dark:text-purple-400">74%</p>
          <span className="text-[10px] text-slate-400">8 Facilities</span>
        </Card>

        {/* 4. Peak Hours */}
        <Card padding="sm" className="space-y-1">
          <span className="text-[10px] font-semibold text-slate-400 uppercase">Peak Hours</span>
          <p className="text-sm font-extrabold text-slate-900 dark:text-slate-100 mt-1">10:00 - 12:00</p>
          <span className="text-[10px] text-orange-500 font-semibold">1,520 Students</span>
        </Card>

        {/* 5. Underutilization */}
        <Card padding="sm" className="space-y-1">
          <span className="text-[10px] font-semibold text-slate-400 uppercase">Underutil.</span>
          <p className="text-lg font-extrabold text-amber-600 dark:text-amber-400">29%</p>
          <span className="text-[10px] text-slate-400">7 Low load spaces</span>
        </Card>

        {/* 6. Overcrowding */}
        <Card padding="sm" className="space-y-1">
          <span className="text-[10px] font-semibold text-slate-400 uppercase">Overcrowd</span>
          <p className="text-lg font-extrabold text-red-600 dark:text-red-400">8.3%</p>
          <span className="text-[10px] text-red-500">2 Sections</span>
        </Card>

        {/* 7. Conflict Rate */}
        <Card padding="sm" className="space-y-1">
          <span className="text-[10px] font-semibold text-slate-400 uppercase">Conflict Rate</span>
          <p className="text-lg font-extrabold text-slate-900 dark:text-slate-100">2.1%</p>
          <span className="text-[10px] text-slate-400">3 of 142 slots</span>
        </Card>

        {/* 8. Resolution Rate */}
        <Card padding="sm" className="space-y-1">
          <span className="text-[10px] font-semibold text-slate-400 uppercase">Res. Rate</span>
          <p className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">94.6%</p>
          <span className="text-[10px] text-emerald-500">Auto-Resolved</span>
        </Card>
      </div>

      {/* ========================================================================= */}
      {/* 19. CHARTS: Line Chart (Hourly Traffic) & Bar Chart (Building Util) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Line Chart: Peak Hours Traffic */}
        <Card padding="md" className="space-y-3">
          <CardHeader>
            <div>
              <CardTitle>Hourly Campus Student Footprint (Line Chart)</CardTitle>
              <CardDescription>Visualizing peak congestion windows and auditorium loads</CardDescription>
            </div>
            <Badge variant="purple">Peak at 11:00 AM</Badge>
          </CardHeader>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={hourlyTrafficData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Line
                  type="monotone"
                  dataKey="students"
                  name="Current Student Footprint"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#3b82f6' }}
                />
                <Line
                  type="monotone"
                  dataKey="baseline"
                  name="Baseline Capacity Threshold"
                  stroke="#94a3b8"
                  strokeDasharray="4 4"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Bar Chart: Building Utilization Before vs After */}
        <Card padding="md" className="space-y-3">
          <CardHeader>
            <div>
              <CardTitle>Wing Utilization Comparison (Bar Chart)</CardTitle>
              <CardDescription>Utilization gain across campus blocks</CardDescription>
            </div>
            <Badge variant="success">+18% Avg Gain</Badge>
          </CardHeader>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={buildingUtilizationData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} />
                <YAxis stroke="#94a3b8" fontSize={11} unit="%" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="before" name="Before Optimization" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="after" name="After Optimization" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* ========================================================================= */}
      {/* 19. CHARTS: Pie / Donut Chart & Before vs After Optimization Comparison */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Pie / Donut Chart: Space Share by Department (5 cols) */}
        <Card className="lg:col-span-5" padding="md">
          <CardHeader>
            <div>
              <CardTitle>Departmental Space Share (Donut Chart)</CardTitle>
              <CardDescription>Distribution of square meters by academic faculty</CardDescription>
            </div>
          </CardHeader>

          <div className="h-60 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={departmentShareData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {departmentShareData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any) => [`${val}% Total Area`, 'Allocation']}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
            {departmentShareData.map((d) => (
              <div key={d.name} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                <span className="text-slate-600 dark:text-slate-400 truncate">{d.name}</span>
                <span className="font-bold text-slate-900 dark:text-slate-100 ml-auto">{d.value}%</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Comparison Chart: Before vs After Optimization (7 cols) */}
        <Card className="lg:col-span-7" padding="md">
          <CardHeader>
            <div>
              <CardTitle>Before vs After Optimization Performance</CardTitle>
              <CardDescription>Measurable reductions in bottlenecks, idle energy, and commute times</CardDescription>
            </div>
            <Badge variant="purple">AI Engine Audit</Badge>
          </CardHeader>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={beforeAfterComparisonData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis type="number" stroke="#94a3b8" fontSize={11} />
                <YAxis dataKey="metric" type="category" stroke="#94a3b8" fontSize={11} width={130} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
                <Bar dataKey="before" name="Before Optimization (Baseline)" fill="#f87171" radius={[0, 4, 4, 0]} />
                <Bar dataKey="after" name="After Optimization (Target)" fill="#34d399" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs flex items-center justify-between">
            <span className="text-slate-600 dark:text-slate-400">Projected Institutional Energy Savings:</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">~₹24,500 / month</span>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
