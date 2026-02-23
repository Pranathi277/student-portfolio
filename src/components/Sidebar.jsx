import { useNavigate, useLocation } from "react-router-dom";
import "../styles/sidebar.css";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { path: "/dashboard", label: "Dashboard", icon: "📊" },
    { path: "/upload", label: "Upload Project", icon: "⬆️" },
    { path: "/projects", label: "My Projects", icon: "📁" },
    { path: "/explore", label: "Explore Projects", icon: "🌎" },
    { path: "/profile", label: "My Profile", icon: "👤" },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("userName");
    window.location.href = "/";
  };

  return (
    <aside className="sidebar">
      {/* Logo Section */}
      <div className="sidebar-logo">
        <div className="logo-icon">SP</div>
        <div className="logo-text">
          <h2>Student Projects</h2>
          <p>Portfolio Platform</p>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="sidebar-menu">
        {menuItems.map((item) => (
          <button
            key={item.path}
            className={`menu-item ${isActive(item.path) ? "active" : ""}`}
            onClick={() => navigate(item.path)}
            title={item.label}
          >
            <span className="menu-icon">{item.icon}</span>
            <span className="menu-label">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Logout Button */}
      <button className="logout-btn" onClick={handleLogout} title="Logout">
        <span className="menu-icon">🚪</span>
        <span className="menu-label">Logout</span>
      </button>
    </aside>
  );
}