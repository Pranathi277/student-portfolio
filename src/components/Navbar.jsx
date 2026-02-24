import { Link, useNavigate } from "react-router-dom";
import "../styles/navbar.css";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <nav className="navbar">
      <h2>Student Platform</h2>

      <div>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/upload">Upload Project</Link>
        <Link to="/projects">My Projects</Link>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </nav>
  );
}