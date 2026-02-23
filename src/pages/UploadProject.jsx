import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "../styles/form.css";
import "../styles/dashboard.css";

export default function UploadProject() {
  const navigate = useNavigate();

  // Check authentication
  useEffect(() => {
    // Scroll to top when page loads
    window.scrollTo(0, 0);
    
    const isLoggedIn = localStorage.getItem("loggedIn");
    if (!isLoggedIn || isLoggedIn !== "true") {
      navigate("/", { replace: true });
      return;
    }
  }, [navigate]);

  const email = localStorage.getItem("currentUser") || "user@gmail.com";
  const userName = localStorage.getItem("userName") || email.split("@")[0];

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    github: "",
    tech: "",
    public: true
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        alert("File size exceeds 10MB limit. Please choose a smaller image.");
        return;
      }
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        alert("Please select an image file.");
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.title.trim()) {
      alert("Please enter a project title.");
      return;
    }
    
    if (!formData.description.trim()) {
      alert("Please enter a project description.");
      return;
    }
    
    if (!formData.tech.trim()) {
      alert("Please enter at least one technology.");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const projects = JSON.parse(localStorage.getItem("projects")) || [];
      
      // Use uploaded image (base64), or fallback to URL, or placeholder
      const projectImage = imagePreview || formData.image || "https://via.placeholder.com/800x400";
      
      const newProject = {
        id: Date.now().toString(),
        title: formData.title.trim(),
        description: formData.description.trim(),
        desc: formData.description.trim(),
        image: projectImage,
        github: formData.github.trim(),
        tech: formData.tech.split(",").map(t => t.trim()).filter(t => t),
        date: new Date().toLocaleDateString(),
        views: 0,
        public: formData.public,
        author: userName,
        authorEmail: email
      };

      projects.push(newProject);
      localStorage.setItem("projects", JSON.stringify(projects));
      
      // Add to recent activities
      const activities = JSON.parse(localStorage.getItem("activities")) || [];
      activities.unshift({
        type: "Uploaded new project",
        projectTitle: formData.title,
        timestamp: new Date().toISOString()
      });
      const limitedActivities = activities.slice(0, 50);
      localStorage.setItem("activities", JSON.stringify(limitedActivities));
      
      // Reset form
      setFormData({
        title: "",
        description: "",
        image: "",
        github: "",
        tech: "",
        public: true
      });
      setImagePreview(null);
      
      alert("Project uploaded successfully!");
      navigate("/projects");
    } catch (error) {
      console.error("Error uploading project:", error);
      alert("An error occurred while uploading. Please try again.");
      setIsSubmitting(false);
    }
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
                {userName.split(" ").map(n => n[0]).join("").toUpperCase()}
              </div>
            </div>
            <span className="help-icon">?</span>
            <button className="share-btn">Share</button>
          </div>
        </div>

        <div className="content">
          <h1>Upload New Project</h1>
          <p>Share your amazing work with the community!</p>

          <form className="upload-form" onSubmit={handleSubmit}>
            <div className="form-section">
              <h3>Project Details</h3>
              
              <label>Project Title*</label>
              <input
                type="text"
                name="title"
                placeholder="E.g., E-Commerce Platform"
                value={formData.title}
                onChange={handleChange}
                required
              />

              <label>Description*</label>
              <textarea
                name="description"
                placeholder="Describe your project in detail. Include key features, challenges, and what you learned."
                value={formData.description}
                onChange={handleChange}
                rows="5"
                required
              />

              <label>Technologies Used*</label>
              <input
                type="text"
                name="tech"
                placeholder="E.g., React, Node js, MongoDB, Express"
                value={formData.tech}
                onChange={handleChange}
                required
              />
              <p className="form-hint">Separate technologies with commas.</p>

              <label>GitHub Link</label>
              <input
                type="url"
                name="github"
                placeholder="https://github.com/username/project"
                value={formData.github}
                onChange={handleChange}
              />
            </div>

            <div className="form-section">
              <h3>Project Images</h3>
              <div 
                className="image-upload-area" 
                onClick={() => document.getElementById("imageInput").click()}
                style={{ cursor: "pointer" }}
              >
                {imagePreview ? (
                  <div>
                    <img src={imagePreview} alt="Preview" className="image-preview" />
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setImagePreview(null);
                        setFormData(prev => ({ ...prev, image: "" }));
                        document.getElementById("imageInput").value = "";
                      }}
                      style={{
                        marginTop: "10px",
                        padding: "8px 16px",
                        background: "#ef4444",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontSize: "12px"
                      }}
                    >
                      Remove Image
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="upload-icon">☁️</div>
                    <p>Click to upload images</p>
                    <p className="upload-hint">PNG, JPG up to 10MB</p>
                  </>
                )}
              </div>
              <input
                id="imageInput"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
              <input
                type="url"
                name="image"
                placeholder="Or enter image URL"
                value={formData.image}
                onChange={handleChange}
                style={{ marginTop: "10px" }}
              />
            </div>

            <div className="form-section">
              <h3>Project Visibility</h3>
              <div className="visibility-toggle">
                <p>Your project will be visible to everyone in Explore Projects.</p>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    name="public"
                    checked={formData.public}
                    onChange={handleChange}
                  />
                  <span className="toggle-label">Public</span>
                </label>
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="cancel-btn" onClick={() => navigate("/dashboard")} disabled={isSubmitting}>
                Cancel
              </button>
              <button type="submit" className="upload-submit-btn" disabled={isSubmitting}>
                {isSubmitting ? "Uploading..." : "⬆ Upload Project"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
