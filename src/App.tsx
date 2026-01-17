import { BrowserRouter, Routes, Route } from "react-router-dom";
import WebsiteApp from "./route/WebsiteApp";
import AdminApp from "./route/AdminApp";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/websiteurl/*" element={<WebsiteApp />} />
        <Route path="/*" element={<AdminApp />} />

        {/* <Route path="/*" element={<WebsiteApp />} />
        <Route path="/admin/*" element={<AdminApp />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;