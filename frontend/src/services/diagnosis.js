import axios from 'axios';
//const baseUrl = 'http://localhost:3001/api/diagnosis';
const baseUrl = 'http://192.168.1.27:3001/api/diagnosis'; //joa
//const baseUrl = 'http://192.168.1.20:3001/api/diagnosis'; //facu
//const baseUrl = 'http://192.168.0.106:3001/api/diagnosis';// facug

const user = JSON.parse(localStorage.getItem('loggedRegMedUser'));
const token = user && user.token && `Bearer ${user.token}`;

//obtener todos los pacientes
const getAllDiagnosis = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

export { getAllDiagnosis };
