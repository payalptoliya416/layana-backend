import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminApp from "./route/AdminApp";
import WebsiteRoutes from "./route/WebsiteRoutes";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/websiteurl/*" element={<WebsiteRoutes />} />
        <Route path="/*" element={<AdminApp />} /> */}

        <Route path="/admin/*" element={<AdminApp />} />
        <Route path="/*" element={<WebsiteRoutes />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;