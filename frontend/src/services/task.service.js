import instance from "../api/axios";

// 📌 Lấy tất cả task theo column
export const getTasksByColumn = (columnId) => {
  return instance.get("/tasks", {
    params: { column_id: columnId }
  });
};

// 📌 Lấy 1 task theo id
export const getTaskById = (id) => {
  return instance.get(`/tasks/${id}`);
};

// 📌 Tạo task mới
export const createTask = (data) => {
  return instance.post("/tasks", data);
};

// 📌 Update task (title, description,...)
export const updateTask = (id, data) => {
  return instance.put(`/tasks/${id}`, data);
};

// 📌 Xóa task
export const deleteTask = (taskId, userId) => {
  return instance.delete(`/tasks/${taskId}`, {
    data: { user_id: userId } // Axios cần 'data' khi DELETE gửi body
  });
};

// 📌 Update position task (drag & drop)
export const updateTaskPosition = (id, position) => {
  return instance.patch(`/tasks/${id}/position`, { position });
};

// 📌 Move task sang column khác (nếu có)
export const moveTaskToColumn = (taskId, targetColumnId, position) => {
  return instance.patch(`/tasks/${taskId}/move`, {
    column_id: targetColumnId,
    position: position
  });
};