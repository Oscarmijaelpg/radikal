import React, { useEffect, useState } from 'react';
import { Toaster } from 'sonner';
import { BrowserRouter, Routes, Route, useLocation, Outlet, Navigate } from 'react-router-dom';
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
import { AuthProvider, useAuth } from './src/context/AuthContext';

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

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, hasBrand } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // ✅ SIEMPRE PERMITIR estas rutas (son flujos especiales)
  const alwaysAllowedRoutes = ['/scanning', '/brand', '/radar-scanning', '/radar-results'];
  if (alwaysAllowedRoutes.includes(location.pathname)) {
    return <>{children}</>;
  }

  // Si user NO tiene brand → forzar a onboarding (excepto si ya está ahí)
  if (!hasBrand && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  // Si user SÍ tiene brand y trata de ir a onboarding → dashboard
  if (hasBrand && location.pathname === '/onboarding') {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, hasBrand } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (user) {
    // Redirect based on brand status
    return <Navigate to={hasBrand ? "/dashboard" : "/onboarding"} replace />;
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />

        {/* Auth Routes (Redirect to Dashboard if logged in) */}
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

        {/* Protected Routes */}
        <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
        <Route path="/scanning" element={<ProtectedRoute><Scanning /></ProtectedRoute>} />
        <Route path="/radar-scanning" element={<ProtectedRoute><RadarScanning /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/generation" element={<ProtectedRoute><ContentGen /></ProtectedRoute>} />
        <Route path="/radar" element={<ProtectedRoute><RadarConfig /></ProtectedRoute>} />
        <Route path="/radar-results" element={<ProtectedRoute><RadarResults /></ProtectedRoute>} />
        <Route path="/brand" element={<ProtectedRoute><BrandAnalysis /></ProtectedRoute>} />
        <Route path="/brand-results" element={<ProtectedRoute><BrandResults /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      </Route>
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <Toaster position="top-center" richColors />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;