import { Routes, Route, Navigate } from "react-router-dom";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";
import EnquiryList from "@/components/bookConsultationList/Enquiry";
import Login from "@/pages/Login";
import ProtectedRoute from "@/components/ProtectedRoute";
import Dashboard from "@/pages/Dashboard";
import Catgeory from "@/components/category/Catgeory";
import LocationList from "@/components/location/LocationList";
import LocationView from "@/components/location/LocationView";
import LocationIndex from "@/components/location/LocationIndex";
import TermsCondition from "@/components/terms&condition/TermsCondition";
import GlobalBookNow from "@/components/globalBookNow/GlobalBookNow";
import BussinessSetting from "@/components/layout/bussinessSetting/BussinessSetting";
import PricesIndex from "@/components/prices/PricesIndex";
import Index from "@/components/treatment/Index";
import TreatmentsList from "@/components/treatment/TreatmentsList";
import SpaPackageList from "@/components/spaPackages/SpaPackageList";
import SpaPackages from "@/components/spaPackages/SpaPackages";
import HomeIndex from "@/components/home/HomeIndex";
import TeamList from "@/components/team/TeamList";
import TeamIndex from "@/components/team/TeamIndex";
import MassageMemberShip from "@/components/layout/massageMembership/MassageMembership";
import MembershipIndex from "@/components/layout/massageMembership/MemmbershipIdex";
import MembershipsFAQs from "@/components/membershipFaqs/MembershipsFAQs";
import PopupIndex from "@/components/popup/PopupIndex";
import PopupList from "@/components/popup/PopupList";
import BookConsultationList from "@/components/bookConsultationList/BookConsultationList";
import NotFound from "@/pages/NotFound";

const AdminRoutes = () => (
  <Routes>
    <Route path="/login" element={<Login />} />

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
    <Route
      path="/prices"
      element={
        <ProtectedRoute>
          <PricesIndex />
        </ProtectedRoute>
      }
    />
    <Route
      path="/enquiry"
      element={
        <ProtectedRoute>
          <EnquiryList />
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
    <Route path="/" element={<Navigate to="/admin/login" replace />} />
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
          <MassageMemberShip />
        </ProtectedRoute>
      }
    />
    <Route
      path="/massage-membership/edit/:id"
      element={
        <ProtectedRoute>
          <MembershipIndex />
        </ProtectedRoute>
      }
    />
    <Route
      path="/massage-membership/add"
      element={
        <ProtectedRoute>
          <MembershipIndex />
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
);

export default AdminRoutes;
