import React from 'react';
import { BrowserRouter, Routes, Route, useLocation, Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './screens/Dashboard';
import Login from './screens/Login';
import Register from './screens/Register';
import Onboarding from './screens/Onboarding';
import Scanning from './screens/Scanning';
import BrandResults from './screens/BrandResults';
import ContentGen from './screens/ContentGen';
import MarketRadar from './screens/MarketRadar';
import BrandAnalysis from './screens/BrandAnalysis';
import RadarConfig from './screens/RadarConfig';
import RadarScanning from './screens/RadarScanning';
import RadarResults from './screens/RadarResults';
import Profile from './screens/Profile';
import Landing from './screens/Landing';

// Layout component to handle Sidebar visibility
const AppLayout = () => {
  const location = useLocation();
  // Screens that should NOT show the sidebar
  const noSidebarRoutes = [
    '/',
    '/login',
    '/register',
    '/onboarding',
    '/scanning',
    '/radar-scanning'
  ];

  const showSidebar = !noSidebarRoutes.includes(location.pathname);

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      {showSidebar && <Sidebar />}

      <main className={`${showSidebar ? 'flex-1 lg:ml-72' : 'w-full'} min-h-screen relative transition-all duration-300`}>
        <div className="max-w-[1920px] mx-auto min-h-screen">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          {/* Public / Auth Flow */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/onboarding" element={<Onboarding />} />

          {/* Immersive Scanning */}
          <Route path="/scanning" element={<Scanning />} />
          <Route path="/radar-scanning" element={<RadarScanning />} />

          {/* Main App */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/generation" element={<ContentGen />} />

          {/* Radar Flow */}
          <Route path="/radar" element={<RadarConfig />} />
          <Route path="/radar-results" element={<RadarResults />} />

          {/* Brand Flow */}
          <Route path="/brand" element={<BrandAnalysis />} />
          <Route path="/brand-results" element={<BrandResults />} />

          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;