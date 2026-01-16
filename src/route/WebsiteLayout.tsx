import Header from "@/websiteComponent/common/Header";
import Footer from "@/websiteComponent/common/Footer";
import { Outlet } from "react-router-dom";

const WebsiteLayout = () => {
  return (
    <div className="website-root">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
};

export default WebsiteLayout;
