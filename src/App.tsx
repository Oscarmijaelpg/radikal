import React, { useEffect, useState } from "react";
import { Toaster } from "sonner";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Outlet,
  Navigate,
} from "react-router-dom";
import Sidebar from "@shared/components/layout/Sidebar";
import Dashboard from "@features/dashboard/screens/Dashboard";
import Login from "@features/auth/screens/Login";
import Register from "@features/auth/screens/Register";
import Onboarding from "@features/onboarding/screens/Onboarding";
import Scanning from "@features/brand-analysis/screens/Scanning";
import BrandResults from "@features/brand-analysis/screens/BrandResults";
import ContentGen from "@features/content-generation/screens/ContentGen";
import MarketRadar from "@features/radar-results/screens/MarketRadar";
import BrandAnalysis from "@features/brand-analysis/screens/BrandAnalysis";
import RadarConfig from "@features/radar-config/screens/RadarConfig";
import RadarScanning from "@features/radar-config/screens/RadarScanning";
import RadarResults from "@features/radar-results/screens/RadarResults";
import Profile from "@features/profile/screens/Profile";
import Landing from "@features/auth/screens/Landing";
import { AuthProvider, useAuth } from "@context/AuthContext";

// Layout component to handle Sidebar visibility
const AppLayout = () => {
  const location = useLocation();
  // Screens that should NOT show the sidebar
  const noSidebarRoutes = [
    "/",
    "/login",
    "/register",
    "/onboarding",
    "/scanning",
    "/radar-scanning",
  ];

  const showSidebar = !noSidebarRoutes.includes(location.pathname);

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      {showSidebar && <Sidebar />}

      <main
        className={`${showSidebar ? "flex-1 lg:ml-72" : "w-full"} min-h-screen relative transition-all duration-300`}
      >
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

  // Special routes that are part of the onboarding flow - allow even without brand
  const onboardingFlowRoutes = ["/scanning", "/radar-scanning"];
  if (onboardingFlowRoutes.includes(location.pathname)) {
    return <>{children}</>;
  }

  // If user is on onboarding page and already has a brand, redirect to dashboard
  if (hasBrand && location.pathname === "/onboarding") {
    return <Navigate to="/dashboard" replace />;
  }

  // If user does NOT have a brand and is trying to access any protected route (except onboarding)
  // redirect them to onboarding
  if (hasBrand === false && location.pathname !== "/onboarding") {
    return <Navigate to="/onboarding" replace />;
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
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/onboarding"
          element={
            <ProtectedRoute>
              <Onboarding />
            </ProtectedRoute>
          }
        />
        <Route
          path="/scanning"
          element={
            <ProtectedRoute>
              <Scanning />
            </ProtectedRoute>
          }
        />
        <Route
          path="/radar-scanning"
          element={
            <ProtectedRoute>
              <RadarScanning />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/generation"
          element={
            <ProtectedRoute>
              <ContentGen />
            </ProtectedRoute>
          }
        />
        <Route
          path="/radar"
          element={
            <ProtectedRoute>
              <RadarConfig />
            </ProtectedRoute>
          }
        />
        <Route
          path="/radar-results"
          element={
            <ProtectedRoute>
              <RadarResults />
            </ProtectedRoute>
          }
        />
        <Route
          path="/brand"
          element={
            <ProtectedRoute>
              <BrandAnalysis />
            </ProtectedRoute>
          }
        />
        <Route
          path="/brand-results"
          element={
            <ProtectedRoute>
              <BrandResults />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
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
