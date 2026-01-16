import NotFound from "@/pages/NotFound"
import ContactUs from "@/websiteComponent/pages/FinchleyPages/contact-us/ContactUs"
import FinchleyCenteral from "@/websiteComponent/pages/FinchleyPages/Finchley/FinchleyCenteral"
import Home from "@/websiteComponent/pages/FinchleyPages/home/Home"
import MemberShip from "@/websiteComponent/pages/FinchleyPages/membership/MemberShip"
import SpaPackages from "@/websiteComponent/pages/FinchleyPages/spa-packages/SpaPackages"
import Team from "@/websiteComponent/pages/FinchleyPages/team/Team"
import TermCondition from "@/websiteComponent/pages/FinchleyPages/term-condition/TermCondition"
import Beauty from "@/websiteComponent/pages/treatments/beauty/Beauty"
import Beautyinviron from "@/websiteComponent/pages/treatments/beauty/Beautyinviron"
import BeautyNail from "@/websiteComponent/pages/treatments/beauty/BeautyNail"
import BeautyWaxing from "@/websiteComponent/pages/treatments/beauty/BeautyWaxing"
import Massage from "@/websiteComponent/pages/treatments/tratementPages/Massage"
import OilMassage from "@/websiteComponent/pages/treatments/tratementPages/OilMassage"
import {  Route, Routes } from "react-router-dom"
import WebsiteLayout from "./WebsiteLayout"

function WebsiteRoutes() {
  return (
    <>
      <Routes>
         <Route element={<WebsiteLayout />}>
        <Route path="/" element={<Home/>}/>
        <Route path="/finchley" element={<FinchleyCenteral/>}/>
        <Route path="/team" element={<Team/>}/>
        <Route path="/term-condition" element={<TermCondition/>}/>

        {/* ---- */}
        <Route path="/treatments" element={<Massage/>}/>
        <Route path="/treatments/belsize-park" element={<Massage/>}/>
        <Route path="/treatments/finchley-central" element={<Massage/>}/>
        <Route path="/treatments/muswell-hill" element={<Massage/>}/>


        <Route path="/treatments/oil-massage" element={<OilMassage/>}/>
        
        {/* ---- */}
        <Route path="/treatments/beauty" element={<Beauty/>}/>
        <Route path="/treatments/beauty-nail" element={<BeautyNail/>}/>
        <Route path="/treatments/beauty-waxing" element={<BeautyWaxing/>}/>
        <Route path="/treatments/beauty-environ" element={<Beautyinviron/>}/>

        {/* ---- */}
        <Route path="/contact-us" element={<ContactUs/>}/>
        {/* ---- */}
        <Route path="/spa-packages/belsize-park" element={<SpaPackages/>}/>
        <Route path="/spa-packages/finchley-central" element={<SpaPackages/>}/>
        <Route path="/spa-packages/muswell-hill" element={<SpaPackages/>}/>
        {/* ---- */}
        <Route path="/memberships/belsize-park" element={<MemberShip/>}/>
        <Route path="/memberships/finchley-central" element={<MemberShip/>}/>
        <Route path="/memberships/muswell-hill" element={<MemberShip/>}/>
         </Route>
   
      <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

export default WebsiteRoutes
