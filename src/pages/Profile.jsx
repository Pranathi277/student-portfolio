import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "../styles/dashboard.css";

export default function Profile() {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Scroll to top when page loads
    window.scrollTo(0, 0);
    
    // Check authentication
    const isLoggedIn = localStorage.getItem("loggedIn");
    if (!isLoggedIn || isLoggedIn !== "true") {
      navigate("/", { replace: true });
      return;
    }
  }, [navigate]);
  
  const email = localStorage.getItem("currentUser") || "user@gmail.com";
  const name = email.split("@")[0];
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const [projectsCount, setProjectsCount] = useState(0);
  const [publicProjectsCount, setPublicProjectsCount] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/projects/user/${email}`);
        if(res.ok) {
          const userProjects = await res.json();
          setProjectsCount(userProjects.length);
          setPublicProjectsCount(userProjects.filter(p => p.isPublic !== false).length);
        }
      } catch(e) {
        console.error("Error fetching stats", e);
      }
    };
    if (email) fetchStats();
  }, [email]);

  return (
    <div className="layout">
      <Sidebar />

      <div className="main">
        <div className="content">
          <h1>My Profile</h1>
          
          <div style={{ background: "white", padding: "30px", borderRadius: "10px", marginTop: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "30px" }}>
              <div className="avatar" style={{ width: "80px", height: "80px", fontSize: "32px" }}>
                {name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2>{name}</h2>
                <p style={{ color: "#666" }}>{email}</p>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginTop: "30px" }}>
              <div style={{ padding: "20px", background: "#f8f9fa", borderRadius: "8px" }}>
                <h3 style={{ margin: 0, color: "#666" }}>Total Projects</h3>
                <p style={{ fontSize: "32px", fontWeight: "bold", margin: "10px 0 0 0" }}>{projectsCount}</p>
              </div>
              <div style={{ padding: "20px", background: "#f8f9fa", borderRadius: "8px" }}>
                <h3 style={{ margin: 0, color: "#666" }}>Public Projects</h3>
                <p style={{ fontSize: "32px", fontWeight: "bold", margin: "10px 0 0 0" }}>
                  {publicProjectsCount}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
