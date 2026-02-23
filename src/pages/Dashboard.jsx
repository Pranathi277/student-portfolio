import "../styles/dashboard.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";

export default function Dashboard() {
  const navigate = useNavigate();
  const [recentActivities, setRecentActivities] = useState([]);

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
  const userName = localStorage.getItem("userName") || email.split("@")[0];
  const name = userName.split(" ")[0]; // Get first name

  const projects = JSON.parse(localStorage.getItem("projects")) || [];
  const activities = JSON.parse(localStorage.getItem("activities")) || [];

  useEffect(() => {
    // Get recent activities (last 24 hours) and format time ago
    const formatTimeAgo = (timestamp) => {
      const now = new Date();
      const activityTime = new Date(timestamp);
      const diffMs = now - activityTime;
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
      if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
      return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
    };

    const last24Hours = activities
      .filter(activity => {
        const activityTime = new Date(activity.timestamp);
        const now = new Date();
        const diffHours = (now - activityTime) / (1000 * 60 * 60);
        return diffHours <= 24;
      })
      .map(activity => ({
        ...activity,
        timeAgo: formatTimeAgo(activity.timestamp)
      }))
      .slice(0, 5); // Show last 5
    
    setRecentActivities(last24Hours);
  }, [activities]);

  const totalProjects = projects.length;
  const publicProjects = projects.filter(p => p.public !== false).length;
  const portfolioViews = parseInt(localStorage.getItem("portfolioViews") || "0");
  const recentActivityCount = recentActivities.length;

  return (
    <div className="layout">
      <Sidebar />

      {/* MAIN */}
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
          <h1>Welcome back, {name}! 👋</h1>
          <p>Here's what's happening with your projects today.</p>

          <div className="stats">
            <div className="card">
              <div className="stat-header">
                <span>Total Projects</span>
                <div className="icon blue">📁</div>
              </div>
              <h2>{totalProjects}</h2>
              <p>All your projects</p>
            </div>

            <div className="card">
              <div className="stat-header">
                <span>Public Projects</span>
                <div className="icon green">📈</div>
              </div>
              <h2>{publicProjects}</h2>
              <p>Visible to everyone</p>
            </div>

            <div className="card">
              <div className="stat-header">
                <span>Portfolio Views</span>
                <div className="icon purple">👁</div>
              </div>
              <h2>{portfolioViews}</h2>
              <p>~+12% from last month</p>
            </div>

            <div className="card">
              <div className="stat-header">
                <span>Recent Activity</span>
                <div className="icon orange">⏰</div>
              </div>
              <h2>{recentActivityCount}</h2>
              <p>In the last 24 hours</p>
            </div>
          </div>

          <div className="dashboard-bottom">
            <div className="quick-actions">
              <h3>Quick Actions</h3>
              <button 
                className="upload-btn" 
                onClick={() => navigate("/upload")}
              >
                ⬆ Upload New Project
              </button>
            </div>

            <div className="recent-activity-section">
              <h3>Recent Activity</h3>
              {recentActivities.length === 0 ? (
                <p className="no-activity">No recent activity</p>
              ) : (
                <div className="activity-list">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="activity-item">
                      <span className="activity-icon">⬆</span>
                      <div className="activity-content">
                        <span className="activity-text">{activity.type}</span>
                        <span className="activity-project">{activity.projectTitle}</span>
                        <span className="activity-time">{activity.timeAgo}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}