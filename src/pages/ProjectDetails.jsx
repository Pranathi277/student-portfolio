import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/dashboard.css";
import "../styles/ProjectDetails.css";

export default function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);

  useEffect(() => {
    // Scroll to top when page loads
    window.scrollTo(0, 0);
    
    // Check authentication
    const isLoggedIn = localStorage.getItem("loggedIn");
    if (!isLoggedIn || isLoggedIn !== "true") {
      navigate("/", { replace: true });
      return;
    }

    // Get project and increment views
    const projects = JSON.parse(localStorage.getItem("projects")) || [];

    // Robust id matching: handle numeric/string ids and mixed types
    const foundProject = projects.find((p) => {
      if (!p || p.id === undefined || p.id === null) return false;
      // match exact
      if (p.id === id) return true;
      // match after coercion
      if (String(p.id) === String(id)) return true;
      if (Number(p.id) === Number(id) && !Number.isNaN(Number(id))) return true;
      return false;
    });

    if (foundProject) {
      // Increment views
      const updatedProjects = projects.map((p) => {
        const matches = (p.id === id) || (String(p.id) === String(id)) || (Number(p.id) === Number(id) && !Number.isNaN(Number(id)));
        return matches ? { ...p, views: (p.views || 0) + 1 } : p;
      });
      localStorage.setItem("projects", JSON.stringify(updatedProjects));
      
      // Set the updated project (use the updated array to get consistent views)
      setProject(updatedProjects.find((p) => String(p.id) === String(id)));
    } else {
      // Debugging aid: log available projects and current user so issues can be diagnosed in console
      // Remove or disable these logs in production
      console.debug("ProjectDetails: project not found for id=", id);
      console.debug("ProjectDetails: stored projects ids=", projects.map(p => p && p.id));
      console.debug("ProjectDetails: currentUser=", localStorage.getItem("currentUser"));
    }
  }, [id, navigate]);

  if (!project) {
    return (
      <div className="layout">
        <Sidebar />
        <div className="main">
          <div className="content">
            <h2>Project not found</h2>
            <button onClick={() => navigate("/projects")}>Back to My Projects</button>
          </div>
        </div>
      </div>
    );
  }

  const email = localStorage.getItem("currentUser") || "user@gmail.com";
  const userName = localStorage.getItem("userName") || email.split("@")[0];

  const normalizeTech = (tech) => {
    if (Array.isArray(tech)) return tech;
    if (typeof tech === 'string') return tech.split(',').map(t => t.trim()).filter(Boolean);
    return [];
  };

  return (
    <div className="layout">
      <Sidebar />

      <div className="main">
        <div className="topbar">
          <div className="search-container">
            <span className="search-icon">🔍</span>
            <input
              className="search"
              placeholder="Search projects, students..."
            />
          </div>

          <div className="topbar-right">
            <div className="notification-bell">🔔</div>
            <div className="profile">
              <div>
                <h4>{userName}</h4>
                <p>{email}</p>
              </div>
              <div className="avatar">
                {userName.split(" ").map(n => n[0]).join("").toUpperCase()}
              </div>
            </div>
            <span className="help-icon">?</span>
            <button className="share-btn">Share</button>
          </div>
        </div>

        <div className="content">
          <button className="back-btn" onClick={() => navigate("/projects")}>
            ← Back to My Projects
          </button>

          <div className="project-details-container">
            <div className="project-header">
              <h1>{project.title}</h1>
              <p className="project-meta">
                {project.date} • 👁️ {project.views || 0} views
              </p>
            </div>

            <img 
              src={project.image || "https://via.placeholder.com/800x400"} 
              alt={project.title}
              className="project-hero-image"
            />

            <div className="project-content">
              <div className="project-main">
                <div className="about-section">
                  <h2>About This Project</h2>
                  <p className="project-full-description">
                    {project.description || project.desc}
                  </p>
                </div>
              </div>

              <div className="project-sidebar">
                <div className="sidebar-card">
                  <h3>Technology Stack</h3>
                  <div className="tech-stack-list">
                    {normalizeTech(project.tech).length > 0 ? (
                      normalizeTech(project.tech).map((tech, i) => (
                        <span key={i} className="tech-badge">{tech}</span>
                      ))
                    ) : (
                      <p className="no-data">No technologies listed</p>
                    )}
                  </div>
                </div>

                <div className="sidebar-card">
                  <h3>Project Link</h3>
                  {project.github ? (
                    <a 
                      href={project.github} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="github-link-btn"
                    >
                      🔗 View on GitHub
                    </a>
                  ) : (
                    <p className="no-data">No GitHub link provided</p>
                  )}
                </div>

                <div className="sidebar-card">
                  <h3>Project Stats</h3>
                  <div className="stats-list">
                    <div className="stat-item">
                      <span className="stat-label">Total Views:</span>
                      <span className="stat-value">{project.views || 0}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Technologies:</span>
                      <span className="stat-value">{project.tech ? project.tech.length : 0}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Visibility:</span>
                      <span className="stat-value">{project.public !== false ? "Public" : "Private"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}