import ContactUs from "@/websiteComponent/pages/FinchleyPages/contact-us/ContactUs";
import FinchleyCenteral from "@/websiteComponent/pages/FinchleyPages/Finchley/FinchleyCenteral";
import Home from "@/websiteComponent/pages/FinchleyPages/home/Home";
import MemberShip from "@/websiteComponent/pages/FinchleyPages/membership/MemberShip";
import SpaPackages from "@/websiteComponent/pages/FinchleyPages/spa-packages/SpaPackages";
import Team from "@/websiteComponent/pages/FinchleyPages/team/Team";
import TermCondition from "@/websiteComponent/pages/FinchleyPages/term-condition/TermCondition";
import Beauty from "@/websiteComponent/pages/treatments/beauty/Beauty";
import Beautyinviron from "@/websiteComponent/pages/treatments/beauty/Beautyinviron";
import BeautyNail from "@/websiteComponent/pages/treatments/beauty/BeautyNail";
import BeautyWaxing from "@/websiteComponent/pages/treatments/beauty/BeautyWaxing";
import Massage from "@/websiteComponent/pages/treatments/tratementPages/Massage";
import OilMassage from "@/websiteComponent/pages/treatments/tratementPages/OilMassage";
import { Navigate, Route, Routes } from "react-router-dom";
import WebsiteLayout from "./WebsiteLayout";
import PricingPage from "@/websiteComponent/pages/pricing/PricingPage";
import ScrollToTop from "./ScrollToTop";
import BookCounsultation from "@/websiteComponent/pages/book-consultation/BookCounsultation";
import NotFound from "@/pages/NotFound";

export const DEFAULT_LOCATION = "finchley-central";

function WebsiteRoutes() {
  return (
    <>
      <ScrollToTop />
      {/*
        <Route path="/team" element={<Team/>}/>    
        <Route path="/treatments/beauty" element={<Beauty/>}/>
        <Route path="/treatments/beauty-nail" element={<BeautyNail/>}/>
        <Route path="/treatments/beauty-waxing" element={<BeautyWaxing/>}/>
        <Route path="/treatments/beauty-environ" element={<Beautyinviron/>}/>
        </Route>
   
      </Routes> */}
      <Routes>
        <Route element={<WebsiteLayout />}>
          <Route path="/" element={<Home />} />

          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/:locationSlug/contact-us" element={<ContactUs />} />

          <Route path="/:locationSlug" element={<FinchleyCenteral />} />

          {/* ================= TREATMENTS ================= */}
          <Route path="/treatments" element={<Massage />} />
          <Route path="/:locationSlug/treatments" element={<Massage />} />
          <Route
            path="/:locationSlug/treatments/:treatmentSlug"
            element={<OilMassage />}
          />
          <Route path="/treatments/:treatmentSlug" element={<OilMassage />} />

          {/* ================= MEMBERSHIPS ================= */}
          <Route path="/:locationSlug/memberships" element={<MemberShip />} />

          {/* ================= SPA PACKAGES ================= */}
          <Route path="/:locationSlug/spa-packages" element={<SpaPackages />} />

          {/* ================= PRICES ================= */}
          <Route path="/:locationSlug/prices" element={<PricingPage />} />

          {/* ================= PRICES ================= */}
          <Route path="/book-consultaion" element={<BookCounsultation />} />

          {/* ================= TERM & CONDITION ================= */}
            <Route path="/term-condition" element={<TermCondition/>}/>
     <Route path="*" element={<Navigate to="/" replace />} />
        </Route>

      </Routes>
    </>
  );
}

export default WebsiteRoutes;
