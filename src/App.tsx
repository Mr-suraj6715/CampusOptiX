import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@/context/ThemeContext';
import { Layout } from '@/components/layout/Layout';

// Page Components
import { Dashboard } from '@/pages/Dashboard/Dashboard';
import { Rooms } from '@/pages/Rooms/Rooms';
import { RoomDetail } from '@/pages/Rooms/RoomDetail';
import { Labs } from '@/pages/Labs/Labs';
import { Classes } from '@/pages/Classes/Classes';
import { FacultyPage } from '@/pages/Faculty/Faculty';
import { Timetable } from '@/pages/Timetable/Timetable';
import { Conflicts } from '@/pages/Conflicts/Conflicts';
import { Optimizer } from '@/pages/Optimizer/Optimizer';
import { LiveCampus } from '@/pages/LiveCampus/LiveCampus';
import { Analytics } from '@/pages/Analytics/Analytics';
import { Simulation } from '@/pages/Simulation/Simulation';
import { EmergencyReallocation } from '@/pages/Emergency/EmergencyReallocation';
import { OptimizationHistory } from '@/pages/History/OptimizationHistory';
import { Notifications } from '@/pages/Notifications/Notifications';
import { Settings } from '@/pages/Settings/Settings';

export const App = () => {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="rooms" element={<Rooms />} />
            <Route path="rooms/:id" element={<RoomDetail />} />
            <Route path="labs" element={<Labs />} />
            <Route path="classes" element={<Classes />} />
            <Route path="faculty" element={<FacultyPage />} />
            <Route path="timetable" element={<Timetable />} />
            <Route path="conflicts" element={<Conflicts />} />
            <Route path="optimizer" element={<Optimizer />} />
            <Route path="live-campus" element={<LiveCampus />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="simulation" element={<Simulation />} />
            <Route path="emergency" element={<EmergencyReallocation />} />
            <Route path="history" element={<OptimizationHistory />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="settings" element={<Settings />} />
            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
