import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DoorOpen,
  FlaskConical,
  AlertTriangle,
  Layers,
  Activity,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Flame,
  RotateCcw,
  Play,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { KPICard } from '@/components/shared/KPICard';
import { OptimizationCard } from '@/components/shared/OptimizationCard';
import { Modal } from '@/components/ui/Modal';

// Charts
import { CampusUtilizationChart } from '@/components/charts/CampusUtilizationChart';
import { RoomUtilizationChart } from '@/components/charts/RoomUtilizationChart';
import { LabUtilizationChart } from '@/components/charts/LabUtilizationChart';
import { ConflictsByTypeChart } from '@/components/charts/ConflictsByTypeChart';
import { DailyUsageChart } from '@/components/charts/DailyUsageChart';

// Data
import {
  mockKPIData,
  campusUtilizationData,
  roomUtilizationData,
  labUtilizationData,
  conflictsByTypeData,
  dailyResourceUsage,
  mockRecommendations,
} from '@/data/mockData';

export const Dashboard = () => {
  const navigate = useNavigate();

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedRecommendation, setSelectedRecommendation] = useState<any>(null);

  const handleLoadDemoScenario = () => {
    setToastMessage('Primary Demo Scenario Loaded: DBMS Lab Capacity Conflict (65 students vs 40 cap).');
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleOpenDemoFlow = () => {
    navigate('/optimizer?scenario=DBMS_Lab');
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div
          className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2"
          style={{
            backgroundColor: 'var(--bg-inverse)',
            color: 'var(--text-inverse)',
          }}
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <p className="text-[13px] font-medium">{toastMessage}</p>
        </div>
      )}

      {/* Demo Scenario Highlight Bar (Base-style dark card) */}
      <div
        className="p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all"
        style={{
          backgroundColor: 'var(--surface-1)',
          border: '1px solid var(--border-primary)',
        }}
      >
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="pill pill-neutral font-mono text-[10px] uppercase">
              Demo Scenario
            </span>
            <span className="text-[12px]" style={{ color: 'var(--text-tertiary)' }}>
              Step 1 of 8
            </span>
          </div>
          <h2 className="text-[16px] font-semibold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Primary Demo: DBMS Lab Capacity Bottleneck (Tue 2:00 PM)
          </h2>
          <p className="text-[12px] max-w-2xl" style={{ color: 'var(--text-secondary)' }}>
            65 enrolled students assigned to Lab B (Capacity: 40). Experience deterministic AI conflict detection, candidate evaluation, explainable reasoning, and 1-click timetable reallocation.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleLoadDemoScenario}
            icon={<RotateCcw className="w-3.5 h-3.5" />}
          >
            Load Demo
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleOpenDemoFlow}
            icon={<Play className="w-3.5 h-3.5" />}
          >
            Launch Optimizer →
          </Button>
        </div>
      </div>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Campus Command Center
          </h1>
          <p className="text-[13px] mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
            Real-time space utilization, active scheduling anomalies, and predictive heuristic optimizations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/emergency')}
            icon={<Flame className="w-3.5 h-3.5 text-red-500" />}
          >
            Emergency Mode
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/simulation')}
            icon={<Sparkles className="w-3.5 h-3.5" />}
          >
            What-If Simulator
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <KPICard
          title="Total Rooms"
          value={mockKPIData.totalRooms}
          subtitle="24 Active Venues"
          icon={<DoorOpen className="w-4 h-4" />}
          onClick={() => navigate('/rooms')}
        />
        <KPICard
          title="Laboratories"
          value={mockKPIData.totalLabs}
          subtitle="8 Specialized Labs"
          icon={<FlaskConical className="w-4 h-4" />}
          onClick={() => navigate('/labs')}
        />
        <KPICard
          title="Active Conflicts"
          value={mockKPIData.activeConflicts}
          subtitle="Requires Arbitration"
          icon={<AlertTriangle className="w-4 h-4 text-red-500" />}
          trend={{ value: 3, label: 'Unresolved', direction: 'neutral' }}
          onClick={() => navigate('/conflicts')}
        />
        <KPICard
          title="Underutilized"
          value={mockKPIData.underutilizedResources}
          subtitle="< 40% Space Load"
          icon={<Layers className="w-4 h-4 text-amber-500" />}
          trend={{ value: 7, label: 'Freed wings', direction: 'down' }}
          onClick={() => navigate('/rooms?status=underutilized')}
        />
        <KPICard
          title="Campus Utilization"
          value={`${mockKPIData.campusUtilization}%`}
          subtitle="Weekly Average"
          icon={<Activity className="w-4 h-4 text-emerald-500" />}
          trend={{ value: 14, label: 'vs last term', direction: 'up' }}
          onClick={() => navigate('/analytics')}
        />
        <KPICard
          title="Resolved"
          value={mockKPIData.resolvedConflicts}
          subtitle="18 Saved Slots"
          icon={<CheckCircle2 className="w-4 h-4" />}
          onClick={() => navigate('/history')}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-7">
          <CampusUtilizationChart data={campusUtilizationData} />
        </div>
        <div className="lg:col-span-5">
          <ConflictsByTypeChart data={conflictsByTypeData} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-6">
          <RoomUtilizationChart data={roomUtilizationData} />
        </div>
        <div className="lg:col-span-6">
          <LabUtilizationChart data={labUtilizationData} />
        </div>
      </div>

      <DailyUsageChart data={dailyResourceUsage} />

      {/* Optimization Proposals */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[15px] font-semibold tracking-tight flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <Sparkles className="w-4 h-4" />
              Optimization Proposals
            </h2>
            <p className="text-[12px]" style={{ color: 'var(--text-tertiary)' }}>
              Heuristic proposals to eliminate overcrowding and reduce institutional energy waste
            </p>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/optimizer')}
            icon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            Open Optimizer
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {mockRecommendations.map((rec) => (
            <OptimizationCard
              key={rec.id}
              item={rec}
              onOptimize={(r) => {
                if (r.id === 'OPT001') {
                  navigate('/optimizer?scenario=DBMS_Lab');
                } else {
                  setSelectedRecommendation(r);
                }
              }}
            />
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedRecommendation && (
        <Modal
          open={!!selectedRecommendation}
          onClose={() => setSelectedRecommendation(null)}
          title={`Optimize: ${selectedRecommendation.title}`}
          description="Review heuristic recommendation impact before applying to master schedule."
          size="md"
          footer={
            <>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setSelectedRecommendation(null)}
              >
                Dismiss
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  const title = selectedRecommendation.title;
                  setSelectedRecommendation(null);
                  setToastMessage(`Optimization proposal applied for "${title}".`);
                  setTimeout(() => setToastMessage(null), 3500);
                }}
              >
                Apply Reallocation
              </Button>
            </>
          }
        >
          <div className="space-y-3 text-[13px]">
            <p style={{ color: 'var(--text-secondary)' }}>
              {selectedRecommendation.description}
            </p>
            {selectedRecommendation.estimatedSaving && (
              <div
                className="p-3 rounded-xl font-semibold text-emerald-500"
                style={{ backgroundColor: 'var(--surface-2)', border: '1px solid var(--border-primary)' }}
              >
                Projected Savings: {selectedRecommendation.estimatedSaving}
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Dashboard;
