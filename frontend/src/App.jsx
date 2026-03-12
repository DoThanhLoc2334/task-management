import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

import Login from "./pages/Authentication/login.jsx";
import Register from "./pages/Authentication/register.jsx";

import WorkspaceDashboard from "./pages/Workspace/Workspacedashboard.jsx";
import WorkspaceMembers from "./pages/Workspace/Workspacemembers.jsx";

import WorkspaceSwitcher from "../src/pages/Workspace/Workspaceswitcher.jsx";
import ProjectBoard from './pages/Project/Projectboard.jsx';
import TaskDetail from "./pages/Task/Taskdetailpage.jsx";
import WorkspaceActivity from "./pages/Workspace/WorkspaceActivity.jsx";
import AppLayout from "./layouts/AppLayout";

function App() {
  return (



      <Routes>

        {/* Auth */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Layout pages */}
        <Route element={<AppLayout />}>
          <Route path="/workspaceswitcher" element={<WorkspaceSwitcher />} />
          <Route path="/workspacedashboard/:id" element={<WorkspaceDashboard />} />
          <Route path="/workspace/:id/members" element={<WorkspaceMembers />} />
          <Route path="/projects/:id" element={<ProjectBoard />} />
          <Route path="/tasks/:taskId" element={<TaskDetail />} />
          <Route path="/workspace/:id/activity" element={<WorkspaceActivity />} />

        </Route>

      </Routes>



  );
}

export default App;