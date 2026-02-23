export default function Explore() {
  const projects =
    JSON.parse(localStorage.getItem("projects")) || [];

  return (
    <div style={{ padding: "40px" }}>
      <h1>Explore Projects</h1>

      {projects.map((p, i) => (
        <div key={i} style={{ background:"white", padding:"15px", marginTop:"10px", borderRadius:"10px" }}>
          <h3>{p.title}</h3>
          <p>{p.desc}</p>
        </div>
      ))}
    </div>
  );
}