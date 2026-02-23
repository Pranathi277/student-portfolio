import { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import "../styles/dashboard.css";
import "../styles/myprojects.css";
import Sidebar from "../components/Sidebar";
export default function MyProjects() {
  const navigate = useNavigate();
  const location = useLocation();
  const [projects, setProjects] = useState([]);
  
  const email = localStorage.getItem("currentUser") || "user@gmail.com";
  const userName = localStorage.getItem("userName") || email.split("@")[0];

  const loadUserProjects = () => {
    // Get only projects uploaded by the current user
    const stored = JSON.parse(localStorage.getItem("projects")) || [];
    const currentUserEmail = localStorage.getItem("currentUser");
    
    // Filter projects: show only those uploaded by current user
    const userProjects = stored.filter(project => {
      if (project.authorEmail) {
        return project.authorEmail === currentUserEmail;
      }
      // For projects without authorEmail (old projects), include them for backward compatibility
      return true;
    });
    
    setProjects(userProjects);
  };

  useEffect(() => {
    // Scroll to top when page loads
    window.scrollTo(0, 0);
    
    // Check authentication
    const isLoggedIn = localStorage.getItem("loggedIn");
    if (!isLoggedIn || isLoggedIn !== "true") {
      navigate("/", { replace: true });
      return;
    }
    
    loadUserProjects();
  }, [location.pathname, navigate]); // Refresh when navigating to this page

  const deleteProject = (id) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      const allProjects = JSON.parse(localStorage.getItem("projects")) || [];
      const updated = allProjects.filter((p) => p.id !== id);
      localStorage.setItem("projects", JSON.stringify(updated));
      
      // Reload user projects
      loadUserProjects();
    }
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
          <h1>My Portfolio</h1>
          <p>Showcase of your {projects.length} amazing {projects.length === 1 ? 'project' : 'projects'}</p>

          {projects.length === 0 ? (
            <div className="empty-state">
              <p>📁 You haven't uploaded any projects yet.</p>
              <button 
                className="upload-first-btn" 
                onClick={() => navigate("/upload")}
              >
                Upload Your First Project
              </button>
            </div>
          ) : (
            <div className="projects-grid">
              {projects.map((project) => (
                <div key={project.id} className="project-card">
                  <div className="project-image-container">
                    <img 
                      src={project.image || "https://via.placeholder.com/400x250"} 
                      alt={project.title}
                      className="project-image"
                    />
                    {project.public !== false && (
                      <span className="public-badge">🌐 Public</span>
                    )}
                  </div>
                  <div className="project-card-content">
                    <h3>{project.title}</h3>
                    <p className="project-description">
                      {project.description || project.desc || "No description"}
                    </p>
                    {project.tech && project.tech.length > 0 && (
                      <div className="tech-tags">
                        {project.tech.slice(0, 3).map((tech, i) => (
                          <span key={i} className="tech-tag">{tech}</span>
                        ))}
                        {project.tech.length > 3 && (
                          <span className="tech-tag more">+{project.tech.length - 3}</span>
                        )}
                      </div>
                    )}
                    <div className="project-card-actions">
                      <button
                        className="view-details-btn"
                        onClick={() => navigate(`/project/${project.id}`)}
                      >
                        View Details 🔗
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => deleteProject(project.id)}
                      >
                        Delete 🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}