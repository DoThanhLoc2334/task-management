import api from '../api/axios';

const login = (data) =>{ 
    console.log("Login data:", data); 
    return api.post('/auth/login', data);
}
const register = (data) =>{ 
  return api.post('/auth/register', data);
}
export {login, register}; 