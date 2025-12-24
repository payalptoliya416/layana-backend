import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import TreatmentsList from "./components/treatment/TreatmentsList";
import Catgeory from "./components/category/Catgeory";
import CategoryAdd from "./components/category/CategoryAdd";
import LocationList from "./components/location/LocationList";
import LocationIndex from "./components/location/LocationIndex";
import LocationView from "./components/location/LocationView";
import BussinessSetting from "./components/layout/bussinessSetting/BussinessSetting";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Login Route */}
          <Route path="/login" element={<Login />} />

          {/* Protected Dashboard Route */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings/category"
            element={
              <ProtectedRoute>
                <Catgeory />
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings/category/add"
            element={
              <ProtectedRoute>
                <CategoryAdd />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings/category/edit/:id"
            element={
              <ProtectedRoute>
                <CategoryAdd />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings/location"
            element={
              <ProtectedRoute>
                <LocationList />
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings/location-view/:id"
            element={
              <ProtectedRoute>
                <LocationView />
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings/location/add"
            element={
              <ProtectedRoute>
                <LocationIndex />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings/location/edit/:id"
            element={
              <ProtectedRoute>
                <LocationIndex />
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <BussinessSetting />
              </ProtectedRoute>
            }
          />

          {/* Protected Treatment Editor Route */}
          <Route
            path="/treatments"
            element={
              <ProtectedRoute>
                <Index />
              </ProtectedRoute>
            }
          />
          <Route
            path="/treatments-list"
            element={
              <ProtectedRoute>
                <TreatmentsList />
              </ProtectedRoute>
            }
          />

          {/* Redirect root to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route
            path="/treatments/edit/:id"
            element={
              <ProtectedRoute>
                <Index />
              </ProtectedRoute>
            }
          />
          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
