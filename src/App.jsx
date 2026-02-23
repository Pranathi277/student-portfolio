import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import UploadProject from "./pages/UploadProject";
import MyProjects from "./pages/MyProjects";
import ProjectDetails from "./pages/ProjectDetails";
import Explore from "./pages/Explore";
import Profile from "./pages/Profile";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* AUTH */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* APP */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/upload" element={<UploadProject />} />
        <Route path="/projects" element={<MyProjects />} />
        <Route path="/project/:id" element={<ProjectDetails />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/profile" element={<Profile />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;