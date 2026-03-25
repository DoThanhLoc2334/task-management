import instance from "../api/axios";

export const getWorkspaces = async () => {
  const res = await instance.get("/workspaces");
  return res.data;
};


export const getWorkspaceById = async (id) => {
  const res = await instance.get(`/workspaces/${id}`);
  return res.data;
};

export const createWorkspace = async (data) => {
  const res = await instance.post("/workspaces", data);
  return res.data;
};

// 🔥 Add member vào workspace
export const addMemberToWorkspace = (workspaceId, data) => {
  return instance.post(`/workspaces/${workspaceId}/members`, data);
};