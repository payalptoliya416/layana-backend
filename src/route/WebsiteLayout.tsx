import Header from "@/websiteComponent/common/Header";
import Footer from "@/websiteComponent/common/Footer";
import { Outlet } from "react-router-dom";
import FixedSocialBar from "@/websiteComponent/common/FixedSocialBar";

const WebsiteLayout = () => {
  return (
    <div className="website-root">
      <Header />
       <FixedSocialBar />
      <Outlet />
      <Footer />
    </div>
  );
};

export default WebsiteLayout;
