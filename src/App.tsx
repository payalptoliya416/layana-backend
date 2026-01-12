import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Index from "./components/treatment/Index";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import TreatmentsList from "./components/treatment/TreatmentsList";
import Catgeory from "./components/category/Catgeory";
import LocationList from "./components/location/LocationList";
import LocationIndex from "./components/location/LocationIndex";
import LocationView from "./components/location/LocationView";
import BussinessSetting from "./components/layout/bussinessSetting/BussinessSetting";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";
import TeamList from "./components/team/TeamList";
import TeamIndex from "./components/team/TeamIndex";
import MassageMembership from "./components/layout/massageMembership/MassageMembership";
import MemmbershipIdex from "./components/layout/massageMembership/MemmbershipIdex";
import MembershipsFAQs from "./components/membershipFaqs/MembershipsFAQs";
import PopupIndex from "./components/popup/PopupIndex";
import PopupList from "./components/popup/PopupList";
import TermsCondition from "./components/terms&condition/TermsCondition";
import SpaPackages from "./components/spaPackages/SpaPackages";
import SpaPackageList from "./components/spaPackages/SpaPackageList";
import HomeIndex from "./components/home/HomeIndex";
import GlobalBookNow from "./components/globalBookNow/GlobalBookNow";
import BookConsultationList from "./components/bookConsultationList/BookConsultationList";

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
            path="/settings/terms-condition"
            element={
              <ProtectedRoute>
                <TermsCondition />
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings/global-booking"
            element={
              <ProtectedRoute>
                <GlobalBookNow />
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
            path="/treatments-list/treatments"
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
            path="/treatments-list/treatments/edit/:id"
            element={
              <ProtectedRoute>
                <Index />
              </ProtectedRoute>
            }
          />

          <Route
            path="/packages-list"
            element={
              <ProtectedRoute>
                <SpaPackageList />
              </ProtectedRoute>
            }
          />

          <Route
            path="/packages-list/packages"
            element={
              <ProtectedRoute>
                <SpaPackages />
              </ProtectedRoute>
            }
          />

          <Route
            path="/packages-list/packages/edit/:id"
            element={
              <ProtectedRoute>
                <SpaPackages />
              </ProtectedRoute>
            }
          />

          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <HomeIndex />
              </ProtectedRoute>
            }
          />

          <Route
            path="/team"
            element={
              <ProtectedRoute>
                <TeamList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/team/edit/:id"
            element={
              <ProtectedRoute>
                <TeamIndex />
              </ProtectedRoute>
            }
          />
          <Route
            path="/team/add"
            element={
              <ProtectedRoute>
                <TeamIndex />
              </ProtectedRoute>
            }
          />

          <Route
            path="/massage-membership"
            element={
              <ProtectedRoute>
                <MassageMembership />
              </ProtectedRoute>
            }
          />
          <Route
            path="/massage-membership/edit/:id"
            element={
              <ProtectedRoute>
                <MemmbershipIdex />
              </ProtectedRoute>
            }
          />
          <Route
            path="/massage-membership/add"
            element={
              <ProtectedRoute>
                <MemmbershipIdex />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/membership-faqs"
            element={
              <ProtectedRoute>
                <MembershipsFAQs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/popup/add"
            element={
              <ProtectedRoute>
                <PopupIndex />
              </ProtectedRoute>
            }
          />
          <Route
            path="/popup/add/:id"
            element={
              <ProtectedRoute>
                <PopupIndex />
              </ProtectedRoute>
            }
          />
          <Route
            path="/popup"
            element={
              <ProtectedRoute>
                <PopupList />
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings/booked-consultation-list"
            element={
              <ProtectedRoute>
                <BookConsultationList />
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
