import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "../styles/dashboard.css";

export default function Explore() {
  const navigate = useNavigate();
  const location = useLocation();
  const [publicProjects, setPublicProjects] = useState([]);
  
  useEffect(() => {
    // Scroll to top when page loads
    window.scrollTo(0, 0);
    
    // Check authentication
    const isLoggedIn = localStorage.getItem("loggedIn");
    if (!isLoggedIn || isLoggedIn !== "true") {
      navigate("/", { replace: true });
      return;
    }
    
    // Page loaded successfully - continue with initialization
    
    // Initialize sample projects if they don't exist
    const initializeSampleProjects = () => {
      const existingProjects = JSON.parse(localStorage.getItem("projects")) || [];
      const sampleProjectsExist = existingProjects.some(p => p.id && p.id.startsWith("sample-"));
      
      if (!sampleProjectsExist) {
        const sampleProjects = [
          {
            id: "sample-1",
            title: "Task Management App",
            description: "A collaborative task management application inspired by Trello. Built with React, TypeScript, and Firebase. Features real-time updates, drag-and-drop functionality, team collaboration, file attachments, and deadline tracking.",
            desc: "A collaborative task management application inspired by Trello. Built with React, TypeScript, and Firebase. Features real-time updates, drag-and-drop functionality, team collaboration, file attachments, and deadline tracking.",
            image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=400&fit=crop",
            github: "https://github.com/alexjohnson/task-manager",
            tech: ["React", "TypeScript", "Firebase", "Tailwind CSS"],
            date: "Feb 13, 2024",
            views: 168,
            public: true,
            author: "Alex Johnson",
            authorEmail: "alex.johnson@university.edu"
          },
          {
            id: "sample-2",
            title: "Weather Forecast Dashboard",
            description: "A beautiful weather dashboard that displays current weather conditions and 7-day forecasts. Uses OpenWeather API for data. Includes location search, favorite locations, interactive charts showing temperature trends, and weather alerts.",
            desc: "A beautiful weather dashboard that displays current weather conditions and 7-day forecasts. Uses OpenWeather API for data. Includes location search, favorite locations, interactive charts showing temperature trends, and weather alerts.",
            image: "https://images.unsplash.com/photo-1419837723367-08e69e6d78ec?w=800&h=400&fit=crop",
            github: "https://github.com/sarahwilliams/weather-dashboard",
            tech: ["React", "Chart.js", "OpenWeather API", "CSS3"],
            date: "Jan 28, 2024",
            views: 234,
            public: true,
            author: "Sarah Williams",
            authorEmail: "sarah.williams@university.edu"
          },
          {
            id: "sample-3",
            title: "E-Commerce Platform",
            description: "Full-stack e-commerce solution with payment integration. Features include product catalog, shopping cart, user authentication, order management, and Stripe payment processing. Built with modern web technologies.",
            desc: "Full-stack e-commerce solution with payment integration. Features include product catalog, shopping cart, user authentication, order management, and Stripe payment processing. Built with modern web technologies.",
            image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=400&fit=crop",
            github: "https://github.com/michaelchen/ecommerce",
            tech: ["React", "Node.js", "MongoDB", "Express", "Stripe"],
            date: "Mar 5, 2024",
            views: 312,
            public: true,
            author: "Michael Chen",
            authorEmail: "michael.chen@university.edu"
          },
          {
            id: "sample-4",
            title: "Social Media Analytics Tool",
            description: "Comprehensive analytics dashboard for social media metrics. Tracks engagement, follower growth, post performance, and provides insights. Integrates with multiple social media APIs and generates detailed reports.",
            desc: "Comprehensive analytics dashboard for social media metrics. Tracks engagement, follower growth, post performance, and provides insights. Integrates with multiple social media APIs and generates detailed reports.",
            image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop",
            github: "https://github.com/emilydavis/social-analytics",
            tech: ["Vue.js", "Python", "Django", "PostgreSQL", "D3.js"],
            date: "Feb 20, 2024",
            views: 189,
            public: true,
            author: "Emily Davis",
            authorEmail: "emily.davis@university.edu"
          },
          {
            id: "sample-5",
            title: "Recipe Sharing Platform",
            description: "Community-driven recipe sharing platform where users can upload, rate, and discover recipes. Features include recipe search, meal planning, shopping list generation, and nutritional information calculation.",
            desc: "Community-driven recipe sharing platform where users can upload, rate, and discover recipes. Features include recipe search, meal planning, shopping list generation, and nutritional information calculation.",
            image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&h=400&fit=crop",
            github: "https://github.com/davidkim/recipe-platform",
            tech: ["Next.js", "Prisma", "PostgreSQL", "AWS S3"],
            date: "Jan 15, 2024",
            views: 445,
            public: true,
            author: "David Kim",
            authorEmail: "david.kim@university.edu"
          }
        ];
        
        const updatedProjects = [...existingProjects, ...sampleProjects];
        localStorage.setItem("projects", JSON.stringify(updatedProjects));
      }
    };
    
    // Initialize sample projects
    initializeSampleProjects();
    
    // Load other users' public projects
    const loadPublicProjects = () => {
      const allProjects = JSON.parse(localStorage.getItem("projects")) || [];
      const currentUserEmail = localStorage.getItem("currentUser");
      
      const filtered = allProjects.filter(p => {
        // Must be public
        if (p.public === false) return false;
        
        // Exclude current user's projects
        if (p.authorEmail && p.authorEmail === currentUserEmail) return false;
        
        // Include projects from other users
        return true;
      });
      
      setPublicProjects(filtered);
    };
    
    loadPublicProjects();
    
    // Listen for storage changes
    const handleStorageChange = () => {
      loadPublicProjects();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
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
                      
                      {project.tech && project.tech.length > 0 && (
                        <div className="explore-tech-tags">
                          {project.tech.map((tech, i) => (
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