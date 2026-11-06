import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiService from "../services/api";
import "../styles/form.css";
import "../styles/layout.css";

export default function AddProject() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");

  const saveProject = async () => {
    try {
      await apiService.createProject({
        title: title,
        description: desc,
        tech: ["React"],
        author: localStorage.getItem("userName") || "Student",
        authorEmail: localStorage.getItem("currentUser") || "student@example.com"
      });
      navigate("/projects");
    } catch (err) {
      console.error(err);
      navigate("/projects");
    }
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
