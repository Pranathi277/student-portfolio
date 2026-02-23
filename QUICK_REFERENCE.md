# Quick Reference - Key Code Snippets

## 1. UploadProject - Image to Base64 Conversion

```javascript
const handleImageChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    if (file.size > 10 * 1024 * 1024) {
      alert("File size exceeds 10MB limit.");
      return;
    }
    
    if (!file.type.startsWith('image/')) {
      alert("Please select an image file.");
      return;
    }
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
      setFormData(prev => ({ ...prev, image: reader.result }));
    };
    reader.readAsDataURL(file); // Converts to Base64
  }
};
```

## 2. Form Validation

```javascript
const handleSubmit = (e) => {
  e.preventDefault();
  
  // Validation
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
  
  // ... save to localStorage
  // ... redirect to /projects
};
```

## 3. Saving Project to LocalStorage

```javascript
const newProject = {
  id: Date.now().toString(),
  title: formData.title.trim(),
  description: formData.description.trim(),
  image: imagePreview || formData.image || "https://via.placeholder.com/800x400",
  github: formData.github.trim(),
  tech: formData.tech.split(",").map(t => t.trim()).filter(t => t),
  date: new Date().toLocaleDateString(),
  views: 0,
  public: formData.public,
  author: userName,
  authorEmail: email
};

const projects = JSON.parse(localStorage.getItem("projects")) || [];
projects.push(newProject);
localStorage.setItem("projects", JSON.stringify(projects));

navigate("/projects"); // Redirect after upload
```

## 4. Loading User Projects

```javascript
const loadUserProjects = () => {
  const stored = JSON.parse(localStorage.getItem("projects")) || [];
  const currentUserEmail = localStorage.getItem("currentUser");
  
  const userProjects = stored.filter(project => {
    if (project.authorEmail) {
      return project.authorEmail === currentUserEmail;
    }
    return true; // Backward compatibility
  });
  
  setProjects(userProjects);
};

useEffect(() => {
  const isLoggedIn = localStorage.getItem("loggedIn");
  if (!isLoggedIn || isLoggedIn !== "true") {
    navigate("/", { replace: true });
    return;
  }
  loadUserProjects();
}, [location.pathname]);
```

## 5. View Count Increment

```javascript
useEffect(() => {
  const projects = JSON.parse(localStorage.getItem("projects")) || [];
  const foundProject = projects.find((p) => p.id === id);

  if (foundProject) {
    // Increment views
    const updatedProjects = projects.map(p => 
      p.id === id ? { ...p, views: (p.views || 0) + 1 } : p
    );
    localStorage.setItem("projects", JSON.stringify(updatedProjects));
    
    // Set the updated project
    setProject(updatedProjects.find((p) => p.id === id));
  }
}, [id]);
```

## 6. Responsive Grid CSS

```css
.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
  margin-top: 30px;
}

.project-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.project-card:hover {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
  transform: translateY(-4px);
}
```

## 7. Navigation with useNavigate

```javascript
const navigate = useNavigate();

// In sidebar
<li onClick={() => navigate("/upload")}>⬆ Upload Project</li>
<li onClick={() => navigate("/projects")}>📁 My Projects</li>

// View details
<button onClick={() => navigate(`/project/${project.id}`)}>
  View Details 🔗
</button>

// Logout
<div onClick={() => {
  localStorage.removeItem("loggedIn");
  localStorage.removeItem("currentUser");
  localStorage.removeItem("userName");
  navigate("/", { replace: true });
}}>
  🚪 Logout
</div>
```

## 8. Authentication Check

```javascript
useEffect(() => {
  const isLoggedIn = localStorage.getItem("loggedIn");
  if (!isLoggedIn || isLoggedIn !== "true") {
    navigate("/", { replace: true });
    return;
  }
}, [navigate]);
```

## 9. Routes Configuration (App.jsx)

```javascript
<BrowserRouter>
  <Routes>
    {/* AUTH */}
    <Route path="/" element={<Login />} />
    <Route path="/signup" element={<Signup />} />

    {/* APP */}
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/upload" element={<UploadProject />} />
    <Route path="/projects" element={<MyProjects />} />
    <Route path="/project/:id" element={<ProjectDetails />} />
    <Route path="/explore" element={<Explore />} />
    <Route path="/profile" element={<Profile />} />
  </Routes>
</BrowserRouter>
```

## 10. Project Card Component

```javascript
<div className="project-card">
  <div className="project-image-container">
    <img 
      src={project.image || "https://via.placeholder.com/400x250"} 
      alt={project.title}
      className="project-image"
    />
    {project.public !== false && (
      <span className="public-badge">🌐 Public</span>
    )}
  </div>
  <div className="project-card-content">
    <h3>{project.title}</h3>
    <p className="project-description">
      {project.description}
    </p>
    <div className="tech-tags">
      {project.tech.slice(0, 3).map((tech, i) => (
        <span key={i} className="tech-tag">{tech}</span>
      ))}
    </div>
    <button onClick={() => navigate(`/project/${project.id}`)}>
      View Details 🔗
    </button>
  </div>
</div>
```

---

## Testing Guide

### 1. Test Upload Page
```
1. Go to http://localhost:5174
2. Login with test credentials
3. Click "Upload Project" 
4. Fill form:
   - Title: "My First Project"
   - Description: "A cool project..."
   - Technologies: "React, Node.js, MongoDB"
   - GitHub: "https://github.com/user/repo"
   - Upload image
   - Toggle public
5. Click "Upload Project"
6. Should redirect to /projects
```

### 2. Test My Projects Page
```
1. Click "My Projects"
2. Should see uploaded project in card grid
3. Hover over card - should see hover effect
4. Click "View Details" - should navigate to project page
5. Click "Delete" - should show confirmation
6. Delete project - should remove from list
```

### 3. Test Project Details
```
1. Upload a project
2. Click "View Details"
3. Check:
   - Image displays
   - Title and description show
   - Tech tags display
   - GitHub link works (opens in new tab)
   - View count shows
   - All stats display
4. Go back - back button works
```

### 4. Test Navigation
```
1. Click sidebar items:
   - Dashboard
   - Upload Project
   - My Projects
   - Explore (placeholder)
   - Profile (placeholder)
2. All should navigate correctly
3. Logout should redirect to login
```

### 5. Test Authentication
```
1. Without logging in, try accessing /projects
2. Should redirect to /
3. Login first
4. Now /projects should be accessible
5. Logout
6. Should go back to /
```

### 6. LocalStorage Check
```
Open DevTools Console:
localStorage.getItem("projects") // View all projects

// Example output:
[{
  id: "1708345200000",
  title: "My Project",
  description: "...",
  tech: ["React", "Node.js"],
  github: "...",
  image: "data:image/png;base64,...",
  date: "02/23/2026",
  views: 5,
  public: true,
  author: "John",
  authorEmail: "john@example.com"
}]
```

---

## Demo Data

To test with sample data, run in console:
```javascript
const sampleProjects = [
  {
    id: "1",
    title: "Chat Application",
    description: "Real-time chat app with WebSocket support",
    tech: ["React", "Node.js", "Socket.io", "MongoDB"],
    github: "https://github.com/sample/chat-app",
    image: "https://via.placeholder.com/800x400?text=Chat+App",
    date: "02/23/2026",
    views: 42,
    public: true,
    author: "John Doe",
    authorEmail: localStorage.getItem("currentUser")
  },
  {
    id: "2",
    title: "E-Commerce Platform",
    description: "Full-stack e-commerce with payment integration",
    tech: ["React", "Express", "MongoDB", "Stripe"],
    github: "https://github.com/sample/ecommerce",
    image: "https://via.placeholder.com/800x400?text=E-Commerce",
    date: "02/22/2026",
    views: 28,
    public: true,
    author: "John Doe",
    authorEmail: localStorage.getItem("currentUser")
  }
];

localStorage.setItem("projects", JSON.stringify(sampleProjects));
location.reload();
```

---

## File Structure

```
src/
├── pages/
│   ├── UploadProject.jsx      ✅ Complete with validation & base64
│   ├── MyProjects.jsx         ✅ Complete with grid & delete
│   ├── ProjectDetails.jsx     ✅ Complete with view count
│   ├── Dashboard.jsx
│   ├── Login.jsx
│   ├── Signup.jsx
│   ├── Explore.jsx
│   └── Profile.jsx
├── components/
│   ├── Sidebar.jsx            ✅ Updated with useNavigate
│   ├── Navbar.jsx
│   ├── ProjectCard.jsx
│   └── Topbar.jsx
├── styles/
│   ├── dashboard.css          ✅ Updated
│   ├── myprojects.css         ✅ Updated
│   ├── ProjectDetails.css     ✅ Updated
│   ├── form.css
│   ├── layout.css
│   └── ...
└── App.jsx                    ✅ Routing complete
```

All files are clean, complete, and fully functional! 🚀
