export const users = [
  {
    id: "u1",
    email: "anh@example.com",
    name: "Tuan Anh",
    created_at: "2026-03-01"
  },
  {
    id: "u2",
    email: "phuocpham@gmail.com",
    name: "Viet Phuoc",
    created_at: "2026-03-02"
  },
  {
    id: "u3",
    email: "locdev@gmail.com",
    name: "Do Loc",
    created_at: "2026-03-02"
  }
];

export const workspaces = [
  {
    id: "w1",
    name: "Software Engineering",
    description: "Task management system development"
  },
  {
    id: "w2",
    name: "test",
    description: "test workspace"
  },
  {
    id: "w4",
    name: "Another Workspace",
    description: "Another test workspace"
  },
    {
    id: "w5",
    name: "test",
    description: "test workspace"
  },
  {
    id: "w6",
    name: "Another Workspace",
    description: "Another test workspace"
  }


];

export const workspaceMembers = [
  {
    id: "wm1",
    workspace_id: "w1",
    user_id: "u1",
    role: "admin"
  },
  {
    id: "wm2",
    workspace_id: "w1",
    user_id: "u2",
    role: "member"
  }
];
export const projects = [
  {
    id: "p1",
    workspace_id: "w1",
    name: "Task Management Platform",
    description: "Build UI and backend system"
  },
  {
    id: "p2",
    workspace_id: "w2",
    name: "Test Project 2",
    description: "Testing workspace project"
  },

  {
    id: "p3",
    workspace_id: "w1",
    name: "Authentication System",
    description: "Login, Register, Forgot password module"
  },
  {
    id: "p4",
    workspace_id: "w1",
    name: "Notification Service",
    description: "Real-time notifications using WebSocket"
  },
  {
    id: "p5",
    workspace_id: "w2",
    name: "Demo Kanban Board",
    description: "Testing drag and drop features"
  },
  {
    id: "p6",
    workspace_id: "w4",
    name: "Bug Tracker",
    description: "Track bugs and assign to developers"
  },
  {
    id: "p7",
    workspace_id: "w4",
    name: "Customer Feedback",
    description: "Collect and manage customer feedback"
  },
  {
    id: "p8",
    workspace_id: "w5",
    name: "Internal Tools",
    description: "Build internal admin tools"
  },
  {
    id: "p9",
    workspace_id: "w6",
    name: "Mobile App Planning",
    description: "Plan tasks for mobile application"
  },
  {
    id: "p10",
    workspace_id: "w6",
    name: "UI Design System",
    description: "Create reusable UI components and guidelines"
  }
];
export const columns = [
  {
    id: "c1",
    project_id: "p1",
    name: "Todo"
  },
  {
    id: "c2",
    project_id: "p1",
    name: "In Progress"
  },
  {
    id: "c3",
    project_id: "p1",
    name: "Review"
  },
  {
    id: "c4",
    project_id: "p1",
    name: "Done"
  }
];

export const tasks = [
  {
    id: "t1",
    column_id: "c1",
    title: "Design Login UI",
    description: "Create login page using React and Bootstrap",
    assignee_id: "u3",
    created_by: "u1",
    start_date: "2026-03-05",
    due_date: "2026-03-08"
  },
  {
    id: "t2",
    column_id: "c2",
    title: "Build Register Page",
    description: "Register form with validation",
    assignee_id: "u2",
    created_by: "u1",
    start_date: "2026-03-04",
    due_date: "2026-03-07"
  },
  {
    id: "t3",
    column_id: "c3",
    title: "Implement Kanban Board",
    description: "Create drag-drop task board",
    assignee_id: "u1",
    created_by: "u1",
    start_date: "2026-03-06",
    due_date: "2026-03-10"
  }
];

export const comments = [
  {
    id: "cm1",
    task_id: "t1",
    user_id: "u1",
    content: "Please finish the UI today"
  },
  {
    id: "cm2",
    task_id: "t1",
    user_id: "u3",
    content: "Working on responsive layout"
  }
];

export const labels = [
  {
    id: "l1",
    project_id: "p1",
    name: "Frontend",
    color: "blue"
  },
  {
    id: "l2",
    project_id: "p1",
    name: "Backend",
    color: "green"
  },
  {
    id: "l3",
    project_id: "p1",
    name: "UI/UX",
    color: "purple"
  }
];

export const taskLabels = [
  {
    id: "tl1",
    task_id: "t1",
    label_id: "l3"
  },
  {
    id: "tl2",
    task_id: "t2",
    label_id: "l1"
  }
];

export const attachments = [
  {
    id: "a1",
    task_id: "t1",
    uploaded_by: "u1",
    file_url: "/files/login-ui.png",
    file_name: "login-ui.png"
  }
];

export const taskDependencies = [
  {
    id: "td1",
    task_id: "t3",
    depends_on_task_id: "t1"
  }
];
export const activityLogs = [
  {
    id: "al1",
    workspace_id: "w1",
    user_id: "u1",
    entity_type: "task",
    entity_id: "t1",
    action: "created task"
  },
  {
    id: "al2",
    workspace_id: "w1",
    user_id: "u2",
    entity_type: "task",
    entity_id: "t2",
    action: "moved task to In Progress"
  }
];