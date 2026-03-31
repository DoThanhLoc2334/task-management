Fullstack Web-Based Task Management System Using JavaScript Technologies
━━━━━━━━━━━━━━━━━━━━
#Project Description
This project is a fullstack web-based task management system designed to support team collaboration and project organization.
The system provides a visual and intuitive interface that enables users to manage tasks efficiently using a Kanban-style board. It allows teams to organize workflows, assign responsibilities, and track progress in a structured and user-friendly manner.
The primary goal of this project is to simulate a real-world productivity platform similar to modern task management tools, while demonstrating fullstack development capabilities using JavaScript technologies.
#Project Objectives
●	Develop a fullstack web application using modern JavaScript technologies
●	Implement secure authentication and authorization mechanisms
●	Provide workspace-based collaboration features
●	Design an intuitive Kanban-based task tracking system
●	Apply RESTful API and scalable system architecture
#Technologies Used
Frontend
●	React.js
●	JavaScript
Backend
●	Node.js
●	Express.js
Database
●	PostgreSQL
Authentication & Security
●	bcrypt / bcryptjs
●	jsonwebtoken (JWT)
Backend Utilities
●	cors
●	dotenv
Database Libraries
●	pg
Development Tools
●	nodemon
●	DBeaver
# System Architecture
The system follows a Client–Server architecture:
●	The frontend (React) handles UI and user interactions
●	The backend (Node.js + Express) processes business logic
●	PostgreSQL stores application data
●	Communication is handled via RESTful APIs
# Features
Authentication
●	User registration and login
●	Secure password hashing using bcrypt
●	JWT-based authentication
●	Cookie-based session handling
 Workspace Management
●	Create, update, and delete workspaces
●	Invite members to workspace
●	Remove members
●	Role-based access control
 Project Management
●	Create, update, and delete projects
●	Organize projects within a workspace
 Kanban Board System
●	Create and manage columns
●	Drag and drop tasks between columns
●	Reorder tasks within a column
●	Visual workflow tracking
 Task Management
●	Create, update, and delete tasks
●	Assign tasks to members
●	Track task status through columns
 Authorization
●	Role-based permissions within each workspace
 Planned Features (Future Development )
●	Task comments
●	File attachments
●	Task labels / tags
 User Roles
Guest
●	Access public content (if available)
Registered User
●	Manage workspaces, projects, and tasks
●	Collaborate with team members
Admin (Workspace Owner)
●	Manage members and permissions
●	Control workspace settings
# Installation & Setup
1. Navigate to backend 
cd backend
2. Install dependencies
npm install
3. Environment variables
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_HOST=localhost
DB_PORT=5432
DB_NAME=yourdbname

JWT_SECRET=yoursecretkey
JWT_REFRESH_SECRET= yoursecretkey
4. PostgreSQL Database Setup
Make sure PostgreSQL and DBeaver is installed and running in DBeaver:
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR UNIQUE NOT NULL,
    name VARCHAR,
    password_hash VARCHAR,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE workspaces (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE workspace_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL,
    user_id UUID NOT NULL,
    role VARCHAR,
    joined_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),

    UNIQUE(workspace_id, user_id)
);

CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL,
    name VARCHAR,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE columns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL,
    name VARCHAR,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    column_id UUID NOT NULL,
    title VARCHAR,
    description TEXT,
    assignee_id UUID,
    created_by UUID NOT NULL,
    start_date TIMESTAMP,
    due_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID NOT NULL,
    user_id UUID NOT NULL,
    content TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE attachments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID NOT NULL,
    uploaded_by UUID NOT NULL,
    file_url TEXT,
    file_name VARCHAR,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE labels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL,
    name VARCHAR,
    color VARCHAR,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE task_labels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID NOT NULL,
    label_id UUID NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),

    UNIQUE(task_id, label_id)
);

CREATE TABLE task_dependencies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID NOT NULL,
    depends_on_task_id UUID NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),

    UNIQUE(task_id, depends_on_task_id),
    CHECK (task_id <> depends_on_task_id)
);

CREATE TABLE activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID,
    user_id UUID,
    entity_type VARCHAR,
    entity_id UUID,
    action VARCHAR,
    created_at TIMESTAMP DEFAULT NOW()
);


ALTER TABLE workspace_members
ADD CONSTRAINT fk_workspace_members_workspace
FOREIGN KEY (workspace_id) REFERENCES workspaces(id);

ALTER TABLE workspace_members
ADD CONSTRAINT fk_workspace_members_user
FOREIGN KEY (user_id) REFERENCES users(id);

ALTER TABLE projects
ADD CONSTRAINT fk_projects_workspace
FOREIGN KEY (workspace_id) REFERENCES workspaces(id);

ALTER TABLE columns
ADD CONSTRAINT fk_columns_project
FOREIGN KEY (project_id) REFERENCES projects(id);

ALTER TABLE tasks
ADD CONSTRAINT fk_tasks_column
FOREIGN KEY (column_id) REFERENCES columns(id);

ALTER TABLE tasks
ADD CONSTRAINT fk_tasks_assignee
FOREIGN KEY (assignee_id) REFERENCES users(id);

ALTER TABLE tasks
ADD CONSTRAINT fk_tasks_creator
FOREIGN KEY (created_by) REFERENCES users(id);

ALTER TABLE comments
ADD CONSTRAINT fk_comments_task
FOREIGN KEY (task_id) REFERENCES tasks(id);

ALTER TABLE comments
ADD CONSTRAINT fk_comments_user
FOREIGN KEY (user_id) REFERENCES users(id);

ALTER TABLE attachments
ADD CONSTRAINT fk_attachments_task
FOREIGN KEY (task_id) REFERENCES tasks(id);

ALTER TABLE attachments
ADD CONSTRAINT fk_attachments_user
FOREIGN KEY (uploaded_by) REFERENCES users(id);

ALTER TABLE labels
ADD CONSTRAINT fk_labels_project
FOREIGN KEY (project_id) REFERENCES projects(id);

ALTER TABLE task_labels
ADD CONSTRAINT fk_tasklabels_task
FOREIGN KEY (task_id) REFERENCES tasks(id);

ALTER TABLE task_labels
ADD CONSTRAINT fk_tasklabels_label
FOREIGN KEY (label_id) REFERENCES labels(id);

ALTER TABLE task_dependencies
ADD CONSTRAINT fk_dependencies_task
FOREIGN KEY (task_id) REFERENCES tasks(id);

ALTER TABLE task_dependencies
ADD CONSTRAINT fk_dependencies_depends
FOREIGN KEY (depends_on_task_id) REFERENCES tasks(id);

ALTER TABLE activity_logs
ADD CONSTRAINT fk_activity_workspace
FOREIGN KEY (workspace_id) REFERENCES workspaces(id);

ALTER TABLE activity_logs
ADD CONSTRAINT fk_activity_user
FOREIGN KEY (user_id) REFERENCES users(id);

ALTER TABLE columns ADD COLUMN position INT DEFAULT 0;

ALTER TABLE tasks 
ADD COLUMN position INTEGER NOT NULL DEFAULT 0;

CREATE INDEX idx_tasks_column_position ON tasks (column_id, position);

ALTER TABLE tasks 
ALTER COLUMN position TYPE DOUBLE PRECISION;



5. Run backend
npm run dev
 Backend: http://localhost:5000
 Frontend Setup 
1. Navigate to frontend
cd frontend
2. Install dependencies
npm install
3. Run frontend
npm run dev
Frontend: http://localhost:3000
 Running the Project
1.	Start PostgreSQL
2.	Run backend server
3.	Run frontend
4.	Open http://localhost:3000
# Project Structure 
Project Structure:
├───backend
│ 	  ├───node_modules
│ 	  └───src
│  		     ├───config
│  		     ├───controllers
│  		     ├───errors
│  		     ├───middleware
│  		     ├───models
│   		     ├───Routers
│  		     ├───services
│  		     └───Utils
└───frontend
    ├───public
    └───src
        ├───api
        ├───assets
        ├───components
        │   ├───board
        │   ├───feedback
        │   ├───form
        │   ├───interaction
        │   ├───navigation
        │   └───task
        ├───layouts
        ├───mock
        ├───modals
        │   ├───Confirm
        │   ├───Creation
        │   ├───Editing
        │   └───Task
        ├───pages
        │   ├───Authentication
        │   ├───Project
        │   ├───System
        │   ├───Task
        │   └───Workspace
        ├───services
        └───Utils

└── README.md

 Project Purpose
This project was developed as part of a university course to demonstrate:
●	Fullstack development skills
●	System design and architecture
●	Real-world application structure
It also serves as a portfolio project for future development.
 Future Improvements
●	Real-time updates (WebSocket)
●	Task dependency system
●	Calendar / timeline view
●	Notification system
●	UI/UX enhancements
 #API Overview 
The system provides a set of RESTful APIs to handle authentication, workspace management, project management, and task operations.
 . Authentication APIs
Endpoint	Method	Request	Response
/api/auth/register	POST	email, password	user object
/api/auth/login	POST	email, password	access token
/api/auth/user	GET	Authorization(Bearer Token)	list user
/api/auth/invitemenber	GET	Authorization(Bearer Token), workspace_id	list user not in workspace
/api/auth/menber	GET	Authorization (Bearer Token), workspace_id	list user in workspace
2.4.2. Workspace APIs
Endpoint	Method	Request	Response
/api/workspaces	POST	name	workspace object
/api/workspaces	GET	Authorization (Bearer Token)	list workspaces
/api/workspaces/:id	GET	Authorization (Bearer Token)	workspace detail
/api/workspaces/:id/members	POST	user_id, role	add member
/api/workspaces/:id/members/:userId	PATCH	role	update role
/api/workspaces/:id/members/me	DELETE	Authorization	leave workspace
/api/workspaces/:id/members/:userId	DELETE	Authorization	remove member
/api/workspaces/:id	DELETE	Authorization	delete workspace
2.4.3. Project APIs
Endpoint	Method	Request	Response
/api/projects	POST	name, workspace_id	project object
/api/projects	GET	Authorization (Bearer Token)	list projects
/api/projects/:id	GET	Authorization	project detail
/api/projects/:id	PUT	name	updated project
/api/projects/:id	DELETE	Authorization	delete project
/api/projects/:projectId/tasks	GET	Authorization	list tasks in project
2.4.4. Task APIs
Endpoint	Method	Request	Response
/api/tasks	GET	column_id	list of tasks
/api/tasks	POST	title, column_id	task object
/api/tasks/:id	PUT	updated fields	updated task
/api/tasks/:id	DELETE	-	success message
2.4.5. Columns APIs
Endpoint	Method	Request	Response
/api/columns	GET	project_id	list columns
/api/columns	POST	name, project_id	column object
/api/columns/:id	PUT	name	updated column
/api/columns/:id	DELETE	-	success message

2.4.6. Authorization
All protected endpoints require authentication using JSON Web Tokens (JWT). The token must be included in the Authorization header of each request.
Role-based access control is enforced at the application level, where permissions are determined based on the user's role within a workspace.


#Screenshots 
 Login Page

 Register Page

 Dashboard

 Kanban Board

 Task Management

 Workspace Management

# Team Members 
No	Full Name	Role
1	Phạm Viết Phước	Database
2	Đỗ Thành Lộc	Backend
3	Lê Tuấn Anh	Frontend

# Notes
●	Ensure PostgreSQL is running before starting backend
●	Environment variables must be configured correctly
●	Some advanced features are under development

# References
●	React.js Documentation
●	Node.js & Express.js Documentation
●	PostgreSQL Documentation
●	JWT Authentication Guide

