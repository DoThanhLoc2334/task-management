import instance from "../api/axios";



//  Lấy danh sách project theo workspace
export const getProjects = (workspaceId) => {
  return instance.get("/projects", {
    params: { workspace_id: workspaceId }
  });
};

//  Lấy 1 project
export const getProjectById = (id) => {
  return instance.get(`/projects/${id}`);
};

//  Tạo project
export const createProject = (data) => {
  return instance.post("/projects", data);
};

// Update project
export const updateProject = (id, data) => {
  return instance.put(`/projects/${id}`, data);
};

// Delete project
export const deleteProject = (id) => {
  return instance.delete(`/projects/${id}`);
};

export const getTasksByProjectId = (projectId) => {
  return instance.get(`/projects/${projectId}/tasks`);
}
