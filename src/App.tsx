import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import { Layout } from '@/components/layout/Layout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

// Auth Pages
import { Login } from '@/pages/Auth/Login';

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
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Login Route */}
            <Route path="/login" element={<Login />} />

            {/* Protected App Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Layout />}>
                {/* Available to All Logged In Roles */}
                <Route index element={<Dashboard />} />
                <Route path="rooms" element={<Rooms />} />
                <Route path="rooms/:id" element={<RoomDetail />} />
                <Route path="labs" element={<Labs />} />
                <Route path="faculty" element={<FacultyPage />} />
                <Route path="timetable" element={<Timetable />} />
                <Route path="live-campus" element={<LiveCampus />} />
                <Route path="notifications" element={<Notifications />} />

                {/* Faculty & Admin Only */}
                <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'FACULTY']} />}>
                  <Route path="classes" element={<Classes />} />
                  <Route path="emergency" element={<EmergencyReallocation />} />
                </Route>

                {/* Admin Only */}
                <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
                  <Route path="conflicts" element={<Conflicts />} />
                  <Route path="optimizer" element={<Optimizer />} />
                  <Route path="analytics" element={<Analytics />} />
                  <Route path="simulation" element={<Simulation />} />
                  <Route path="history" element={<OptimizationHistory />} />
                  <Route path="settings" element={<Settings />} />
                </Route>

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;

