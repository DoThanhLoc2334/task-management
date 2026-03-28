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


export const addMemberToWorkspace = (workspaceId, data) => {
  return instance.post(`/workspaces/${workspaceId}/members`, data);
};

export const removeMemberFromWorkspace = (workspaceId, userId) => {
  return instance.delete(`/workspaces/${workspaceId}/members/${userId}`);
};