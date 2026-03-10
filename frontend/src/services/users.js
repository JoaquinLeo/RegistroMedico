import axios from 'axios';
//const baseUrl = 'http://localhost:3001/api/users';
const baseUrl = 'http://192.168.1.27:3001/api/users'; //joa
//const baseUrl = 'http://192.168.1.20:3001/api/users'; //facu
//const baseUrl = 'http://192.168.0.106:3001/api/users';// facug

//Registra nuevo usuario
export const registerNewUser = async (newUser) => {
  const request = axios.post(baseUrl, newUser);

  return request.then((response) => response.data);
};

//Obtiene usuarios para ver los deshabilitados
export const getUsers = () => {
  const request = axios.get(baseUrl);

  return request.then((response) => response.data);
};

//Edita el estado de Habilitado del usuario
export const enableUser = (username) => {
  const request = axios.put(`${baseUrl}/${username}`);

  return request.then((response) => response.data);
};
