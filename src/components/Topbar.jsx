import "../styles/layout.css";

export default function Topbar() {
  return (
    <div className="topbar">
      <input
        className="search-box"
        placeholder="Search projects, students..."
      />

      <div>
        <span style={{ marginRight: "20px" }}>🔔</span>
        <span>AJ</span>
      </div>
    </div>
  );
}