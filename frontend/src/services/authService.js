import instance from "../api/axios"; 

const login = (data) =>{ 
    console.log("Login data:", data); 
    return instance.post('/auth/login', data);
}
const register = (data) =>{ 
  return instance.post('/auth/register', data);
}
// 📌 Lấy danh sách người dùng (cần auth)
const getUsers = () => {
  return instance.get("/auth/user");
};

// 📌 Lấy danh sách người dùng chưa có trong workspace
const getUsersNotInWorkspace = (workspaceId) => {
  return instance.get(`/auth/invitemenber?workspace_id=${workspaceId}`);
};
const getUsersInWorkspace = (workspaceId) => {
  return instance.get(`/auth/menber?workspace_id=${workspaceId}`);
}
export {login, register,getUsers,getUsersNotInWorkspace,getUsersInWorkspace}; 

