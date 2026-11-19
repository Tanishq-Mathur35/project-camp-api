# Project Camp Frontend

A modern, responsive, and intuitive web application for **Project Camp Backend** built with React 18, Vite, Tailwind CSS, Lucide Icons, and React Router v6.

---

## 🚀 Features

### 1. Authentication & Security

- **Secure JWT Session Management**: Automatically handles access and refresh tokens with HTTP-only cookies and Authorization headers.
- **Auto Token Refresh**: Silent background interceptor refreshes access tokens when expired.
- **Complete Auth Suite**: User registration, login (via email or username), email verification, password reset, and password change.
- **Route Protection**: Role and guest-protected routes.

### 2. Project Management

- **Dashboard**: View all projects you administer or collaborate in with member count and role badges.
- **Quick Metrics**: Overview statistics of your projects and roles.
- **Create & Edit**: Create new project spaces or update details (Admin only).
- **Cascade Deletion**: Safely delete projects with confirmation (Admin only).

### 3. Task Management & Kanban Board

- **Three-Tier Kanban Workflow**: Categorized by `To Do`, `In Progress`, and `Done`.
- **Task Creation & Updates**: Assign tasks to team members with status, description, and multi-file attachments.
- **Quick Status Shifts**: Instantly move tasks between stages.
- **Subtasks Tracking**:
    - Add and delete subtasks (Admin / Project Admin).
    - Checkbox toggle completion status (open to all project members per PRD).
    - Live progress bar showing sprint task completion.

### 4. Project Notes

- **Knowledge Base**: Document project architectural notes, meeting logs, and decisions.
- **Creator Details**: Displays author avatar, username, and formatted timestamps.
- **Permission Enforced**: Create, edit, and delete notes (Admin only).

### 5. Team Member Management

- **Team Roster**: View all collaborators in a project with owner indicator.
- **Invite Members**: Add team members by email and assign roles (`Admin`, `Project Admin`, `Member`).
- **Role Administration**: Promote or demote member roles on the fly (Admin only).
- **Member Removal**: Remove collaborators from a project (Admin only).

---

## 🛠️ Tech Stack

- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS + Custom Dark Mode UI
- **Routing**: React Router DOM v6
- **Icons**: Lucide React
- **HTTP Client**: Axios with request/response interceptors

---

## 🏃 Getting Started

### 1. Start the Backend Server (from root directory)

```bash
npm run dev
# Running on http://localhost:8000
```

### 2. Start the Frontend Application (from `FRONTEND/` folder)

```bash
cd FRONTEND
npm run dev
# Running on http://localhost:5173
```

Open [http://localhost:5173](http://localhost:5173) in your browser.
