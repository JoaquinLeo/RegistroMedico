import axios from 'axios';
//const baseUrl = 'http://localhost:3001/api/login';
const baseUrl = 'http://192.168.1.27:3001/api/login'; //joa
//const baseUrl = 'http://192.168.1.20:3001/api/login'; //facu
//const baseUrl = 'http://192.168.0.106:3001/api/login';// facug

//envía las credenciales y según lo que reciba (data) seguirá la app
export const login = async (credentials) => {
  const { data } = await axios.post(baseUrl, credentials);
  console.log(data);
  return data;
};
