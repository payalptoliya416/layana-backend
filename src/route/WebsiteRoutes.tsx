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

export const DEFAULT_LOCATION = "finchley-central";

function WebsiteRoutes() {
  return (
    <>
      <ScrollToTop />
      {/* <Routes>
         <Route element={<WebsiteLayout />}>
        <Route path="/" element={<Home/>}/>
       <Route path="/:locationSlug" element={<FinchleyCenteral />} /> 
        <Route path="/team" element={<Team/>}/>
        <Route path="/term-condition" element={<TermCondition/>}/>

        <Route path="/treatments" element={<Massage/>}/>
        <Route path="/treatments/belsize-park" element={<Massage/>}/>
        <Route path="/treatments/finchley-central" element={<Massage/>}/>
        <Route path="/treatments/muswell-hill" element={<Massage/>}/>

        <Route path="/treatments/oil-massage" element={<OilMassage/>}/>
        
        <Route path="/treatments">
        <Route index element={<Massage />} />
        <Route path=":slug" element={<OilMassage />} />
      </Route>
        <Route path="/treatments/beauty" element={<Beauty/>}/>
        <Route path="/treatments/beauty-nail" element={<BeautyNail/>}/>
        <Route path="/treatments/beauty-waxing" element={<BeautyWaxing/>}/>
        <Route path="/treatments/beauty-environ" element={<Beautyinviron/>}/>

        <Route path="/contact-us" element={<ContactUs/>}/>
   
        <Route path="/spa-packages/belsize-park" element={<SpaPackages/>}/>
        <Route path="/spa-packages/finchley-central" element={<SpaPackages/>}/>
        <Route path="/spa-packages/muswell-hill" element={<SpaPackages/>}/>
       
        <Route path="/memberships/belsize-park" element={<MemberShip/>}/>
        <Route path="/memberships/finchley-central" element={<MemberShip/>}/>
        <Route path="/memberships/muswell-hill" element={<MemberShip/>}/>
      
        <Route path="/prices/finchley-central/massage-beauty" element={<PricingPage/>}/>
        <Route path="/prices/finchley-central/skin" element={<PricingPage/>}/>
        <Route path="/prices/finchley-central/laser" element={<PricingPage/>}/>
        <Route path="/prices/muswell-hill/massage-beauty" element={<PricingPage/>}/>
        <Route path="/prices/belsize-park/massage-beauty" element={<PricingPage/>}/>
        </Route>
   
         <Route path="*" element={<Navigate to="#" replace />} />
      </Routes> */}

      <Routes>
        <Route element={<WebsiteLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/team" element={<Team />} />
          <Route path="/term-condition" element={<TermCondition />} />

          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/:locationSlug/contact-us" element={<ContactUs />} />

          <Route path="/:locationSlug" element={<FinchleyCenteral />} />

          <Route path="/treatments" element={<Massage/>}/>
          <Route path="/finchley-central/:treatmentSlug" element={<Massage/>}/>
          <Route path="/:locationSlug/:treatmentSlug" element={<Massage/>}/>
          <Route path="/:locationSlug/treatments" element={<Massage />} />
          <Route
            path="/:locationSlug/treatments/:treatmentSlug"
            element={<OilMassage />}
          />

          <Route path="/:locationSlug/treatments/beauty" element={<Beauty />} />
          <Route
            path="/:locationSlug/treatments/beauty-nail"
            element={<BeautyNail />}
          />
          <Route
            path="/:locationSlug/treatments/beauty-waxing"
            element={<BeautyWaxing />}
          />
          <Route
            path="/:locationSlug/treatments/beauty-environ"
            element={<Beautyinviron />}
          />

          <Route path="/:locationSlug/memberships" element={<MemberShip />} />

          <Route path="/:locationSlug/spa-packages" element={<SpaPackages />} />

          <Route
            path="/:locationSlug/prices/:serviceSlug"
            element={<PricingPage />}
          />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default WebsiteRoutes;
