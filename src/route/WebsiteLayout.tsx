import Header from "@/websiteComponent/common/Header";
import Footer from "@/websiteComponent/common/Footer";
import { Outlet } from "react-router-dom";
import FixedSocialBar from "@/websiteComponent/common/FixedSocialBar";
import CookieConsent from "@/websiteComponent/common/CookieConsent";

const WebsiteLayout = () => {
  
  return (
    <div className="website-root">
      <Header />
      <CookieConsent />
      <FixedSocialBar />
      <Outlet />
      <Footer />
    </div>
  );
};

export default WebsiteLayout;
