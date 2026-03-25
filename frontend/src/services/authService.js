import instance from "../api/axios"; 

const login = (data) =>{ 
    console.log("Login data:", data); 
    return instance.post('/auth/login', data);
}
const register = (data) =>{ 
  return instance.post('/auth/register', data);
}
export {login, register}; 

