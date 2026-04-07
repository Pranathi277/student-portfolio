import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/form.css";
import "../styles/layout.css";

export default function AddProject() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");

  const saveProject = () => {
  fetch(import.meta.env.VITE_API_BASE_URL + "/api/projects", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      title: title,
      description: desc,
      student: {
        id: 2
      }
    })
  })
  .then(res => res.json())
  .then(() => {
    navigate("/my-projects"); // keep your flow
  });
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
