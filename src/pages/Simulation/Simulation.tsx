import React, { useState } from 'react';
import {
  Sliders,
  Play,
  RotateCcw,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Building,
  Users,
  Clock,
  ArrowRight,
  ShieldAlert,
  HelpCircle,
  TrendingUp,
  DoorOpen,
  Calendar,
  Layers,
  Zap,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { ProgressBar } from '@/components/ui/ProgressBar';

type EventType =
  | 'Room becomes unavailable'
  | 'Additional students join'
  | 'Faculty becomes unavailable'
  | 'New class added';

interface SimulationResultData {
  affectedClasses: {
    code: string;
    name: string;
    faculty: string;
    students: number;
    currentRoom: string;
    recommendedAltRoom: string;
  }[];
  newConflicts: number;
  alternativeRooms: {
    name: string;
    capacity: number;
    suitability: string;
    score: number;
  }[];
  currentUtilization: number;
  expectedUtilization: number;
  recommendedChanges: string[];
}

export const Simulation = () => {
  // Controls (Section 17 Requirements)
  const [eventType, setEventType] = useState<EventType>('Room becomes unavailable');
  const [selectedResource, setSelectedResource] = useState<string>('Lab B204 (DBMS Lab)');
  const [startTime, setStartTime] = useState<string>('09:00 AM');
  const [endTime, setEndTime] = useState<string>('05:00 PM');
  const [additionalCount, setAdditionalCount] = useState<number>(25);

  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [hasRun, setHasRun] = useState<boolean>(true);
  const [activeSimulationResult, setActiveSimulationResult] = useState<SimulationResultData>({
    affectedClasses: [
      {
        code: 'CS351',
        name: 'Database Management Systems Lab',
        faculty: 'Dr. Priya Mehta',
        students: 65,
        currentRoom: 'Lab B204',
        recommendedAltRoom: 'Lab A (Block A, Fl 1)',
      },
      {
        code: 'CS201',
        name: 'Data Structures Practical',
        faculty: 'Dr. Rajesh Kumar',
        students: 53,
        currentRoom: 'Lab B204',
        recommendedAltRoom: 'CS Lab 1 (Block A, Fl 0)',
      },
      {
        code: 'CS450',
        name: 'Machine Learning Lab',
        faculty: 'Prof. Anita Sharma',
        students: 48,
        currentRoom: 'Lab B204',
        recommendedAltRoom: 'Lab C (Block C, Fl 2)',
      },
    ],
    newConflicts: 2,
    alternativeRooms: [
      { name: 'Lab A (Block A)', capacity: 80, suitability: 'Exact Match (80 DB Workstations)', score: 96 },
      { name: 'CS Lab 1 (Block A)', capacity: 40, suitability: 'Requires Batch Splitting', score: 84 },
      { name: 'Lab C (Block C)', capacity: 70, suitability: 'Standard PCs - LAN Ready', score: 81 },
    ],
    currentUtilization: 62,
    expectedUtilization: 76,
    recommendedChanges: [
      'Relocate DBMS Lab (CS351) from Lab B204 to Lab A (09:00 - 11:00 AM).',
      'Shift Data Structures (CS201) to CS Lab 1 with zero timetable overlap.',
      'Schedule Machine Learning session into Lab C afternoon window.',
    ],
  });

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      setHasRun(true);

      // Generate dynamic results based on selected event
      if (eventType === 'Additional students join') {
        setActiveSimulationResult({
          affectedClasses: [
            {
              code: 'CS201',
              name: 'Data Structures (Div A)',
              faculty: 'Dr. Rajesh Kumar',
              students: 53 + additionalCount,
              currentRoom: 'Room A101 (Cap 60)',
              recommendedAltRoom: 'Room B204 (Cap 80)',
            },
          ],
          newConflicts: 1,
          alternativeRooms: [
            { name: 'Room B204 (Block B)', capacity: 80, suitability: 'Accommodates 78 students', score: 94 },
            { name: 'Room D102 (Block D)', capacity: 120, suitability: 'Large Lecture Hall', score: 88 },
          ],
          currentUtilization: 62,
          expectedUtilization: 79,
          recommendedChanges: [
            `Reallocate CS201 from Room A101 to Room B204 to safely hold ${53 + additionalCount} students.`,
            'Recalculate fire exit clear zones for 75+ seated cohort.',
          ],
        });
      } else if (eventType === 'Faculty becomes unavailable') {
        setActiveSimulationResult({
          affectedClasses: [
            {
              code: 'CS301',
              name: 'DBMS Theory',
              faculty: 'Dr. Priya Mehta (Unavailable)',
              students: 55,
              currentRoom: 'Room A101',
              recommendedAltRoom: 'Substitute: Dr. Dinesh Patel',
            },
            {
              code: 'CS351',
              name: 'DBMS Lab',
              faculty: 'Dr. Priya Mehta (Unavailable)',
              students: 65,
              currentRoom: 'DBMS Lab',
              recommendedAltRoom: 'Substitute: Prof. Anita Sharma',
            },
          ],
          newConflicts: 2,
          alternativeRooms: [
            { name: 'Dr. Dinesh Patel', capacity: 60, suitability: 'Available Tuesday Morning', score: 92 },
            { name: 'Prof. Anita Sharma', capacity: 80, suitability: 'Has 6 available teaching hours', score: 89 },
          ],
          currentUtilization: 62,
          expectedUtilization: 65,
          recommendedChanges: [
            'Assign Assistant Professor Dr. Dinesh Patel as interim lecturer for CS301.',
            'Delegate CS351 lab grading to Prof. Anita Sharma.',
          ],
        });
      } else {
        // Room unavailable / New class added
        setActiveSimulationResult({
          affectedClasses: [
            {
              code: 'CS351',
              name: 'Database Management Systems Lab',
              faculty: 'Dr. Priya Mehta',
              students: 65,
              currentRoom: selectedResource,
              recommendedAltRoom: 'Lab A (Block A, Fl 1)',
            },
            {
              code: 'CS201',
              name: 'Data Structures Practical',
              faculty: 'Dr. Rajesh Kumar',
              students: 53,
              currentRoom: selectedResource,
              recommendedAltRoom: 'CS Lab 1 (Block A, Fl 0)',
            },
          ],
          newConflicts: 2,
          alternativeRooms: [
            { name: 'Lab A (Block A)', capacity: 80, suitability: 'Exact Match (80 DB Workstations)', score: 96 },
            { name: 'CS Lab 1 (Block A)', capacity: 40, suitability: 'Requires Batch Splitting', score: 84 },
          ],
          currentUtilization: 62,
          expectedUtilization: 76,
          recommendedChanges: [
            `Reroute classes out of ${selectedResource} between ${startTime} and ${endTime}.`,
            'Deploy Lab A as primary substitute venue.',
          ],
        });
      }
    }, 900);
  };

  const handleReset = () => {
    setEventType('Room becomes unavailable');
    setSelectedResource('Lab B204 (DBMS Lab)');
    setStartTime('09:00 AM');
    setEndTime('05:00 PM');
    setAdditionalCount(25);
    handleRunSimulation();
  };

  return (
    <div className="space-y-6">
      {/* Simulation Banner Notice (Section 17 Requirement) */}
      <div className="p-3.5 rounded-2xl bg-amber-500/10 dark:bg-amber-950/40 border-2 border-dashed border-amber-400 dark:border-amber-700 flex items-center justify-between text-xs text-amber-900 dark:text-amber-200">
        <div className="flex items-center gap-2.5 font-bold">
          <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
          <span>
            SIMULATION SANDBOX ACTIVE: What-if scenarios run in an isolated environment. No official campus timetables or room bookings are modified.
          </span>
        </div>
        <Badge variant="warning">SANDBOX MODE</Badge>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 dark:from-cyan-400 dark:via-blue-300 dark:to-indigo-300 bg-clip-text text-transparent">
              What-If Campus Simulator
            </h1>
            <Badge variant="purple">AI Predictive Sandbox</Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Model unpredictable disruptions, enrollment surges, and unplanned maintenance before committing changes.
          </p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={handleReset}
          icon={<RotateCcw className="w-3.5 h-3.5" />}
        >
          Reset Simulator
        </Button>
      </div>

      {/* ========================================================================= */}
      {/* 17. CONTROLS: Event Type, Resource, Start Time, End Time */}
      {/* ========================================================================= */}
      <Card padding="md" className="space-y-4">
        <CardHeader>
          <div>
            <CardTitle>Simulation Scenario Controls</CardTitle>
            <CardDescription>Configure the trigger disruption or academic policy change</CardDescription>
          </div>
          <Sliders className="w-4 h-4 text-blue-600" />
        </CardHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. Event Type */}
          <Select
            label="1. Event Type"
            value={eventType}
            onChange={(e) => setEventType(e.target.value as EventType)}
            options={[
              { value: 'Room becomes unavailable', label: 'Room becomes unavailable' },
              { value: 'Additional students join', label: 'Additional students join' },
              { value: 'Faculty becomes unavailable', label: 'Faculty becomes unavailable' },
              { value: 'New class added', label: 'New class added' },
            ]}
          />

          {/* 2. Target Resource */}
          {eventType === 'Faculty becomes unavailable' ? (
            <Select
              label="2. Unavailable Faculty"
              value={selectedResource}
              onChange={(e) => setSelectedResource(e.target.value)}
              options={[
                { value: 'Dr. Priya Mehta', label: 'Dr. Priya Mehta (DBMS)' },
                { value: 'Dr. Rajesh Kumar', label: 'Dr. Rajesh Kumar (CS)' },
                { value: 'Prof. Suresh Nair', label: 'Prof. Suresh Nair (Math)' },
                { value: 'Dr. Mohan Rao', label: 'Dr. Mohan Rao (Physics)' },
              ]}
            />
          ) : eventType === 'Additional students join' ? (
            <Input
              label="2. Additional Student Count"
              type="number"
              min={5}
              max={100}
              value={additionalCount}
              onChange={(e) => setAdditionalCount(Number(e.target.value))}
            />
          ) : (
            <Select
              label="2. Target Room / Resource"
              value={selectedResource}
              onChange={(e) => setSelectedResource(e.target.value)}
              options={[
                { value: 'Lab B204 (DBMS Lab)', label: 'Lab B204 (DBMS Lab)' },
                { value: 'Room A101 (Classroom)', label: 'Room A101 (Classroom)' },
                { value: 'Room D102 (Auditorium)', label: 'Room D102 (Auditorium)' },
                { value: 'Chemistry Lab (Block B)', label: 'Chemistry Lab (Block B)' },
              ]}
            />
          )}

          {/* 3. Start Time */}
          <Select
            label="3. Disruption Start Time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            options={[
              { value: '08:00 AM', label: '08:00 AM' },
              { value: '09:00 AM', label: '09:00 AM' },
              { value: '11:00 AM', label: '11:00 AM' },
              { value: '02:00 PM', label: '02:00 PM' },
            ]}
          />

          {/* 4. End Time */}
          <Select
            label="4. Disruption End Time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            options={[
              { value: '12:00 PM', label: '12:00 PM (Half Day)' },
              { value: '05:00 PM', label: '05:00 PM (Full Day)' },
              { value: 'End of Semester', label: 'End of Semester (Permanent)' },
            ]}
          />
        </div>

        <div className="pt-2 flex items-center justify-end">
          <Button
            variant="primary"
            size="md"
            onClick={handleRunSimulation}
            loading={isSimulating}
            icon={<Play className="w-4 h-4 fill-white" />}
          >
            Run Simulation
          </Button>
        </div>
      </Card>

      {/* ========================================================================= */}
      {/* 17. CURRENT STATE VS SIMULATED STATE */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* CURRENT STATE */}
        <Card padding="md" className="border-l-4 border-l-slate-400 dark:border-l-slate-600 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              CURRENT LIVE CAMPUS STATE
            </span>
            <Badge variant="slate">Baseline</Badge>
          </div>

          <div className="grid grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-700 dark:text-slate-300 font-bold uppercase">Active Conflicts</span>
              <p className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">3</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-700 dark:text-slate-300 font-bold uppercase">Campus Utilization</span>
              <p className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                {activeSimulationResult.currentUtilization}%
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-700 dark:text-slate-300 font-bold uppercase">Available Venues</span>
              <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">8 Rooms</p>
            </div>
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
            Standard working timetable operating across 24 rooms.
          </p>
        </Card>

        {/* SIMULATED STATE */}
        <Card padding="md" className="border-l-4 border-l-blue-600 bg-blue-50/20 dark:bg-blue-950/20 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              SIMULATED SCENARIO STATE
            </span>
            <Badge variant="purple">Simulated</Badge>
          </div>

          <div className="grid grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-900">
              <span className="text-[10px] text-slate-700 dark:text-slate-300 font-bold uppercase">New Conflicts</span>
              <p className="text-xl font-bold text-red-600 dark:text-red-400 mt-0.5">
                +{activeSimulationResult.newConflicts}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-900">
              <span className="text-[10px] text-slate-700 dark:text-slate-300 font-bold uppercase">Projected Utilization</span>
              <p className="text-xl font-bold text-blue-600 dark:text-blue-400 mt-0.5">
                {activeSimulationResult.expectedUtilization}%
              </p>
            </div>
            <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-900">
              <span className="text-[10px] text-slate-700 dark:text-slate-300 font-bold uppercase">Affected Cohorts</span>
              <p className="text-xl font-bold text-amber-600 dark:text-amber-400 mt-0.5">
                {activeSimulationResult.affectedClasses.length} Classes
              </p>
            </div>
          </div>
          <p className="text-xs text-blue-900 dark:text-blue-300 font-medium">
            AI solver rebalanced the load with a predicted feasibility rating of <strong>94%</strong>.
          </p>
        </Card>
      </div>

      {/* ========================================================================= */}
      {/* 17. RESULTS BREAKDOWN: Affected Classes, Alternatives, Expected Util, Rec Changes */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Affected Classes Table (7 cols) */}
        <Card className="lg:col-span-7" padding="md">
          <CardHeader>
            <div>
              <CardTitle>Affected Academic Classes ({activeSimulationResult.affectedClasses.length})</CardTitle>
              <CardDescription>Courses disrupted by the simulated trigger</CardDescription>
            </div>
            <Badge variant="error">Immediate Action Needed</Badge>
          </CardHeader>

          <div className="space-y-3">
            {activeSimulationResult.affectedClasses.map((cls, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded">
                      {cls.code}
                    </span>
                    <h4 className="font-bold text-slate-900 dark:text-slate-100">{cls.name}</h4>
                  </div>
                  <span className="font-semibold text-slate-500">{cls.students} Students</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-slate-600 dark:text-slate-300 font-mono">
                  <p>Faculty: <strong>{cls.faculty}</strong></p>
                  <p>Disrupted Room: <strong className="text-red-500 line-through">{cls.currentRoom}</strong></p>
                </div>

                <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 flex items-center justify-between text-emerald-800 dark:text-emerald-300">
                  <span className="font-medium">Recommended Substitute:</span>
                  <span className="font-bold">{cls.recommendedAltRoom}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Alternative Rooms & Recommended Changes (5 cols) */}
        <Card className="lg:col-span-5 flex flex-col justify-between" padding="md">
          <div className="space-y-4">
            <CardHeader>
              <div>
                <CardTitle>Candidate Alternative Rooms</CardTitle>
                <CardDescription>Ranked by AI compatibility index</CardDescription>
              </div>
            </CardHeader>

            <div className="space-y-2.5">
              {activeSimulationResult.alternativeRooms.map((alt, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 text-xs flex items-center justify-between gap-3"
                >
                  <div className="space-y-0.5">
                    <p className="font-bold text-slate-900 dark:text-slate-100">{alt.name}</p>
                    <p className="text-[11px] text-slate-500">{alt.suitability} • Cap: {alt.capacity}</p>
                  </div>
                  <span className="font-mono font-bold text-blue-600 dark:text-blue-400 text-xs bg-blue-50 dark:bg-blue-950/60 px-2 py-1 rounded-md">
                    Score {alt.score}
                  </span>
                </div>
              ))}
            </div>

            {/* Recommended Changes */}
            <div className="p-3.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 space-y-2 text-xs">
              <p className="font-bold text-blue-900 dark:text-blue-200 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                Recommended Automated Changes:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-blue-950 dark:text-blue-100">
                {activeSimulationResult.recommendedChanges.map((ch, i) => (
                  <li key={i}>{ch}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-800 dark:text-slate-200 font-medium">
            <span>Expected Utilization: <strong className="text-slate-950 dark:text-white font-bold">{activeSimulationResult.expectedUtilization}%</strong></span>
            <Button
              variant="primary"
              size="sm"
              onClick={() => alert('Simulation parameters staged for deployment in the Emergency Reallocation center!')}
            >
              Stage Changes →
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Simulation;
