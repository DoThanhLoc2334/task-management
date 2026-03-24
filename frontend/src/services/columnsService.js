import instance from "../api/axios";

// 📌 Lấy tất cả cột theo project
export const getColumnsByProject = (projectId) => {
  return instance.get("/columns", {
    params: { project_id: projectId }
  });
};

// 📌 Lấy 1 column theo id
export const getColumnById = (id) => {
  return instance.get(`/columns/${id}`);
};

// 📌 Tạo column mới
export const createColumn = (data) => {
  return instance.post("/columns", data);
};

// 📌 Update column (chỉ name)
export const updateColumn = (id, data) => {
  return instance.put(`/columns/${id}`, data);
};

// 📌 Xóa column
export const deleteColumn = (id) => {
  return instance.delete(`/columns/${id}`);
};

// 📌 Update position column
export const updateColumnPosition = (id, position) => {
  return instance.patch(`/columns/${id}/position`, { position });
};