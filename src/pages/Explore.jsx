import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "../styles/dashboard.css";

export default function Explore() {
  const navigate = useNavigate();
  const location = useLocation();
  const [publicProjects, setPublicProjects] = useState([]);

  // Normalize tech field to an array to avoid runtime errors when data is a string or missing
  const normalizeTech = (tech) => {
    if (Array.isArray(tech)) return tech;
    if (typeof tech === 'string') {
      return tech.split(',').map(t => t.trim()).filter(Boolean);
    }
    return [];
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
    
    // Load other users' public projects
    const loadPublicProjects = async () => {
      try {
        const response = await fetch(import.meta.env.VITE_API_BASE_URL + "/api/projects");
        if (response.ok) {
          const allProjects = await response.json();
          const currentUserEmail = localStorage.getItem("currentUser");
          
          const filtered = allProjects.filter(p => {
            // Must be public (note the API sends back isPublic)
            if (p.isPublic === false && p.public === false) return false;
            
            // Exclude current user's projects
            if (p.authorEmail && p.authorEmail === currentUserEmail) return false;
            
            // Include projects from other users
            return true;
          });
          
          setPublicProjects(filtered);
        }
      } catch (error) {
        console.error("Error fetching projects", error);
      }
    };
    
    loadPublicProjects();
    
  }, [location.pathname]); // Refresh when navigating to this page
  
  const email = localStorage.getItem("currentUser") || "user@gmail.com";
  const userName = localStorage.getItem("userName") || email.split("@")[0];

  const getAvatarColor = (name) => {
    const colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
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
                {getInitials(userName)}
              </div>
            </div>
            <span className="help-icon">?</span>
            <button className="share-btn">Share</button>
          </div>
        </div>

        <div className="content">
          <h1>Explore Projects</h1>
          <p>Discover amazing projects from students around the world!</p>

          <div className="explore-projects-list">
            {publicProjects.length === 0 ? (
              <div className="empty-state">
                <p>No public projects from other students available yet.</p>
                <p style={{ marginTop: "10px", fontSize: "14px", color: "#6b7280" }}>
                  Upload your own project to get started!
                </p>
              </div>
            ) : (
              publicProjects.map((project) => {
                const authorName = project.author || "Unknown Student";
                const authorEmail = project.authorEmail || "student@example.com";
                const avatarColor = getAvatarColor(authorName);
                
                return (
                  <div key={project.id} className="explore-project-card">
                    <div className="project-author-header">
                      <div className="author-info">
                        <div 
                          className="author-avatar" 
                          style={{ background: avatarColor }}
                        >
                          {getInitials(authorName)}
                        </div>
                        <div>
                          <h4 className="author-name">{authorName}</h4>
                          <p className="author-email">{authorEmail}</p>
                        </div>
                      </div>
                      <button className="view-profile-btn">View Profile</button>
                    </div>

                    <div 
                      className="explore-project-image"
                      onClick={() => navigate(`/project/${project.id}`)}
                    >
                      <img 
                        src={project.image || "https://via.placeholder.com/800x400"} 
                        alt={project.title}
                      />
                    </div>

                    <div className="explore-project-content">
                      <h3 onClick={() => navigate(`/project/${project.id}`)}>
                        {project.title}
                      </h3>
                      <p className="explore-project-description">
                        {project.description || project.desc || "No description available"}
                      </p>
                      
                      {normalizeTech(project.tech).length > 0 && (
                        <div className="explore-tech-tags">
                          {normalizeTech(project.tech).map((tech, i) => (
                            <span key={i} className="explore-tech-tag">{tech}</span>
                          ))}
                        </div>
                      )}

                      <div className="explore-project-meta">
                        <span>{project.views || 0} views</span>
                        <span>•</span>
                        <span>{project.date}</span>
                      </div>

                      <button 
                        className="explore-view-details-btn"
                        onClick={() => navigate(`/project/${project.id}`)}
                      >
                        View Details ✏️
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
