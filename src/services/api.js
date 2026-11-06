// Centralized API Service with Smart Backend + LocalStorage Hybrid Fallback
// This ensures the application works seamlessly on GitHub Pages (static hosting)
// while continuing to connect to the Spring Boot backend when available.

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

// Seed Data for Offline / Demo / GitHub Pages Mode
const DEFAULT_USERS = [
  {
    id: 1,
    name: "Pranthi",
    email: "indlasuvarna03@gmail.com",
    password: "password",
    summary: "Full Stack Developer passionate about modern web technologies."
  },
  {
    id: 2,
    name: "Demo Student",
    email: "student@example.com",
    password: "password123",
    summary: "Computer Science student exploring web applications and APIs."
  }
];

const DEFAULT_PROJECTS = [
  {
    id: "1",
    title: "E-Commerce Platform",
    description: "A comprehensive full-stack e-commerce application featuring responsive UI, shopping cart, product catalog, payment checkout simulation, and order tracking.",
    tech: ["React", "Node.js", "Express", "MongoDB", "Tailwind CSS"],
    github: "https://github.com/Pranathi277/student-portfolio",
    image: "https://images.unsplash.com/photo-1557821552-17105176677c?w=800&auto=format&fit=crop&q=60",
    date: "10/12/2026",
    views: 42,
    isPublic: true,
    public: true,
    author: "Pranthi",
    authorEmail: "indlasuvarna03@gmail.com"
  },
  {
    id: "2",
    title: "AI Study & Notes Assistant",
    description: "An intelligent productivity app that summarizes lecture notes, generates flashcards, and provides AI-driven quizzes for university students.",
    tech: ["Python", "FastAPI", "React", "OpenAI", "PostgreSQL"],
    github: "https://github.com/Pranathi277/student-portfolio",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60",
    date: "10/15/2026",
    views: 29,
    isPublic: true,
    public: true,
    author: "Demo Student",
    authorEmail: "student@example.com"
  },
  {
    id: "3",
    title: "Student Portfolio Showcase",
    description: "A modern web portal enabling students to showcase academic projects, track portfolio views, network with peers, and share verified credentials.",
    tech: ["React", "Spring Boot", "MySQL", "Vite", "REST API"],
    github: "https://github.com/Pranathi277/student-portfolio",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=60",
    date: "11/01/2026",
    views: 58,
    isPublic: true,
    public: true,
    author: "Pranthi",
    authorEmail: "indlasuvarna03@gmail.com"
  }
];

const DEFAULT_ACTIVITIES = [
  {
    id: 1,
    type: "Uploaded new project",
    projectTitle: "Student Portfolio Showcase",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 2,
    type: "Updated project details",
    projectTitle: "E-Commerce Platform",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
  }
];

// Helper functions for LocalStorage management
function getLocalUsers() {
  const users = localStorage.getItem("portfolio_users");
  if (!users) {
    localStorage.setItem("portfolio_users", JSON.stringify(DEFAULT_USERS));
    return DEFAULT_USERS;
  }
  try {
    return JSON.parse(users);
  } catch (e) {
    return DEFAULT_USERS;
  }
}

function saveLocalUsers(users) {
  localStorage.setItem("portfolio_users", JSON.stringify(users));
}

function getLocalProjects() {
  const projects = localStorage.getItem("portfolio_projects");
  if (!projects) {
    localStorage.setItem("portfolio_projects", JSON.stringify(DEFAULT_PROJECTS));
    return DEFAULT_PROJECTS;
  }
  try {
    return JSON.parse(projects);
  } catch (e) {
    return DEFAULT_PROJECTS;
  }
}

function saveLocalProjects(projects) {
  localStorage.setItem("portfolio_projects", JSON.stringify(projects));
}

function getLocalActivities() {
  const activities = localStorage.getItem("portfolio_activities");
  if (!activities) {
    localStorage.setItem("portfolio_activities", JSON.stringify(DEFAULT_ACTIVITIES));
    return DEFAULT_ACTIVITIES;
  }
  try {
    return JSON.parse(activities);
  } catch (e) {
    return DEFAULT_ACTIVITIES;
  }
}

function saveLocalActivities(activities) {
  localStorage.setItem("portfolio_activities", JSON.stringify(activities));
}

// Check if a remote backend request is feasible
function canAttemptBackend() {
  // If no base URL is defined, or we are on HTTPS (like GitHub Pages) and base URL is HTTP,
  // browsers will block mixed-content requests anyway.
  if (!BASE_URL || BASE_URL.trim() === "") return false;
  if (typeof window !== "undefined" && window.location.protocol === "https:" && BASE_URL.startsWith("http://")) {
    return false;
  }
  return true;
}

export const apiService = {
  // USER SIGNUP
  async signup({ name, email, password, summary = "New User" }) {
    if (canAttemptBackend()) {
      try {
        const response = await fetch(`${BASE_URL}/api/users/signup`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password, summary })
        });

        if (response.ok) {
          const data = await response.json();
          // Keep local mirror updated
          const localUsers = getLocalUsers().filter(u => u.email !== email);
          localUsers.push(data);
          saveLocalUsers(localUsers);
          return { success: true, user: data };
        } else if (response.status === 400) {
          return { success: false, message: "Email is already registered. Please login instead." };
        }
        // If 404/500, proceed to fallback
      } catch (err) {
        console.warn("Backend unavailable during signup, using local storage fallback:", err.message);
      }
    }

    // Local Storage Fallback
    const localUsers = getLocalUsers();
    const existing = localUsers.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    if (existing) {
      return { success: false, message: "Email is already registered. Please login instead." };
    }

    const newUser = {
      id: Date.now(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      summary: summary || "New User"
    };
    localUsers.push(newUser);
    saveLocalUsers(localUsers);
    return { success: true, user: newUser };
  },

  // USER LOGIN
  async login({ email, password }) {
    const cleanEmail = email.trim().toLowerCase();

    if (canAttemptBackend()) {
      try {
        const response = await fetch(`${BASE_URL}/api/users/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: cleanEmail, password })
        });

        if (response.ok) {
          const data = await response.json();
          return { success: true, user: data };
        } else if (response.status === 401) {
          return { success: false, message: "Invalid email or password." };
        }
      } catch (err) {
        console.warn("Backend unavailable during login, checking local fallback:", err.message);
      }
    }

    // Local Storage Fallback
    const localUsers = getLocalUsers();
    const found = localUsers.find(
      u => u.email.toLowerCase() === cleanEmail && u.password === password
    );

    if (found) {
      return { success: true, user: found };
    }

    return { success: false, message: "Invalid email or password." };
  },

  // FORGOT PASSWORD
  async forgotPassword(email) {
    const cleanEmail = email.trim().toLowerCase();

    if (canAttemptBackend()) {
      try {
        const response = await fetch(`${BASE_URL}/api/users/forgot-password`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: cleanEmail })
        });

        const data = await response.json().catch(() => ({}));
        if (response.ok) {
          return { success: true, message: data.message || "OTP sent to your email!" };
        } else if (response.status === 400) {
          return { success: false, message: data.message || "User not found." };
        }
      } catch (err) {
        console.warn("Backend unavailable for forgot-password, using demo OTP:", err.message);
      }
    }

    // Local Storage Fallback
    const localUsers = getLocalUsers();
    const found = localUsers.find(u => u.email.toLowerCase() === cleanEmail);
    if (!found) {
      return { success: false, message: "No account found with this email." };
    }

    const demoOtp = "123456";
    sessionStorage.setItem("portfolio_reset_email", cleanEmail);
    sessionStorage.setItem("portfolio_reset_otp", demoOtp);
    return {
      success: true,
      message: `OTP generated! In demo mode, your OTP is: ${demoOtp}`
    };
  },

  // RESET PASSWORD
  async resetPassword({ email, otp, newPassword }) {
    const cleanEmail = email.trim().toLowerCase();

    if (canAttemptBackend()) {
      try {
        const response = await fetch(`${BASE_URL}/api/users/reset-password`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: cleanEmail, otp: otp.trim(), newPassword })
        });

        const data = await response.json().catch(() => ({}));
        if (response.ok) {
          return { success: true, message: data.message || "Password reset successfully!" };
        } else {
          return { success: false, message: data.message || "Invalid or expired OTP." };
        }
      } catch (err) {
        console.warn("Backend unavailable for reset-password, using local fallback:", err.message);
      }
    }

    // Local Storage Fallback
    const savedEmail = sessionStorage.getItem("portfolio_reset_email");
    const savedOtp = sessionStorage.getItem("portfolio_reset_otp");

    if (savedOtp && otp.trim() === savedOtp && (!savedEmail || savedEmail === cleanEmail)) {
      const localUsers = getLocalUsers();
      const user = localUsers.find(u => u.email.toLowerCase() === cleanEmail);
      if (user) {
        user.password = newPassword;
        saveLocalUsers(localUsers);
      }
      sessionStorage.removeItem("portfolio_reset_email");
      sessionStorage.removeItem("portfolio_reset_otp");
      return { success: true, message: "Password reset successfully! You can now login." };
    }

    return { success: false, message: "Invalid OTP. Please check the OTP and try again." };
  },

  // GET USER PROJECTS
  async getUserProjects(email) {
    const cleanEmail = email ? email.trim().toLowerCase() : "";

    if (canAttemptBackend()) {
      try {
        const response = await fetch(`${BASE_URL}/api/projects/user/${encodeURIComponent(cleanEmail)}`);
        if (response.ok) {
          return await response.json();
        }
      } catch (err) {
        console.warn("Backend unavailable for getUserProjects, reading from local storage:", err.message);
      }
    }

    // Local Storage Fallback
    const localProjects = getLocalProjects();
    return localProjects.filter(
      p => (p.authorEmail || "").toLowerCase() === cleanEmail
    );
  },

  // GET ALL PUBLIC PROJECTS
  async getAllProjects() {
    if (canAttemptBackend()) {
      try {
        const response = await fetch(`${BASE_URL}/api/projects`);
        if (response.ok) {
          return await response.json();
        }
      } catch (err) {
        console.warn("Backend unavailable for getAllProjects, reading from local storage:", err.message);
      }
    }

    // Local Storage Fallback
    return getLocalProjects();
  },

  // CREATE PROJECT
  async createProject(projectData) {
    if (canAttemptBackend()) {
      try {
        const response = await fetch(`${BASE_URL}/api/projects`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(projectData)
        });

        if (response.ok) {
          const saved = await response.json();
          // Update local mirror
          const localProjects = getLocalProjects();
          localProjects.unshift(saved);
          saveLocalProjects(localProjects);
          return saved;
        }
      } catch (err) {
        console.warn("Backend unavailable for createProject, saving locally:", err.message);
      }
    }

    // Local Storage Fallback
    const localProjects = getLocalProjects();
    const newProject = {
      ...projectData,
      id: String(Date.now()),
      date: projectData.date || new Date().toLocaleDateString(),
      views: projectData.views || 0,
      isPublic: projectData.isPublic !== false && projectData.public !== false,
      public: projectData.isPublic !== false && projectData.public !== false
    };
    localProjects.unshift(newProject);
    saveLocalProjects(localProjects);
    return newProject;
  },

  // DELETE PROJECT
  async deleteProject(id) {
    if (canAttemptBackend()) {
      try {
        const response = await fetch(`${BASE_URL}/api/projects/${id}`, {
          method: "DELETE"
        });
        if (response.ok) {
          // Remove from local mirror
          const localProjects = getLocalProjects().filter(p => String(p.id) !== String(id));
          saveLocalProjects(localProjects);
          return true;
        }
      } catch (err) {
        console.warn("Backend unavailable for deleteProject, removing locally:", err.message);
      }
    }

    // Local Storage Fallback
    const localProjects = getLocalProjects().filter(p => String(p.id) !== String(id));
    saveLocalProjects(localProjects);
    return true;
  },

  // GET ACTIVITIES
  async getActivities() {
    if (canAttemptBackend()) {
      try {
        const response = await fetch(`${BASE_URL}/api/activities`);
        if (response.ok) {
          return await response.json();
        }
      } catch (err) {
        console.warn("Backend unavailable for getActivities, reading locally:", err.message);
      }
    }

    // Local Storage Fallback
    return getLocalActivities();
  },

  // CREATE ACTIVITY
  async createActivity(activityData) {
    if (canAttemptBackend()) {
      try {
        const response = await fetch(`${BASE_URL}/api/activities`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(activityData)
        });
        if (response.ok) {
          const saved = await response.json();
          const localActivities = getLocalActivities();
          localActivities.unshift(saved);
          saveLocalActivities(localActivities);
          return saved;
        }
      } catch (err) {
        console.warn("Backend unavailable for createActivity, saving locally:", err.message);
      }
    }

    // Local Storage Fallback
    const localActivities = getLocalActivities();
    const newActivity = {
      id: Date.now(),
      ...activityData,
      timestamp: activityData.timestamp || new Date().toISOString()
    };
    localActivities.unshift(newActivity);
    saveLocalActivities(localActivities);
    return newActivity;
  }
};

export default apiService;
