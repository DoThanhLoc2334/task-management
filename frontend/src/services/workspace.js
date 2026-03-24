import api from "../api/axios";


export const getWorkspaces = async () => {
  const res = await api.get("/workspaces");
  return res.data;
};


export const getWorkspaceById = async (id) => {
  const res = await api.get(`/workspaces/${id}`);
  return res.data;
};

export const createWorkspace = async (data) => {
  const res = await api.post("/workspaces", data);
  return res.data;
};