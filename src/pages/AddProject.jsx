import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/form.css";
import "../styles/layout.css";

export default function AddProject() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");

  const saveProject = () => {
    const projects =
      JSON.parse(localStorage.getItem("projects")) || [];

    const newProject = {
      id: Date.now().toString(),
      title,
      desc,
      description: desc,
      image: "https://via.placeholder.com/800x400",
      github: "",
      tech: [],
      date: new Date().toLocaleDateString(),
      views: 0,
      public: true
    };

    projects.push(newProject);

    localStorage.setItem("projects", JSON.stringify(projects));
    navigate("/dashboard");
  };

  return (
    <div className="form">
      <h2>Add Project</h2>

      <input placeholder="Project Title" onChange={(e)=>setTitle(e.target.value)} />
      <textarea placeholder="Description" onChange={(e)=>setDesc(e.target.value)} />

      <button onClick={saveProject}>Save</button>
    </div>
  );
}