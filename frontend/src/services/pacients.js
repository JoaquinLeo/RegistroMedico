import axios from 'axios';
//const baseUrl = 'http://localhost:3001/api/pacients';
const baseUrl = 'http://192.168.1.27:3001/api/pacients'; //joa
//const baseUrl = 'http://192.168.1.20:3001/api/pacients'; //facu
//const baseUrl = 'http://192.168.0.106:3001/api/pacients';// facug

const user = JSON.parse(localStorage.getItem('loggedRegMedUser'));
const token = user && user.token && `Bearer ${user.token}`;

//obtener todos los pacientes
const getAllPacients = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};
//obtener paciente por DNI
const getPacientByDni = (dni) => {
  const request = axios.get(`${baseUrl}/${dni}`);
  return request.then((response) => response.data[0]);
};

//obtener Logs de paciente por DNI
const getPacientLogByDni = (dni) => {
  const request = axios.get(`${baseUrl}/log/${dni}`);
  return request.then((response) => response.data);
};

//Agrega Diagnóstico a paciente
const putPacientDiagnosis = (dni, diagnosis) => {
  const config = {
    headers: {
      Authorization: token,
    },
  };
  console.log('llego', dni, diagnosis);
  const request = axios.put(
    `${baseUrl}/add-new-diagnosis/${dni}`,
    diagnosis,
    config
  );
  return request.then((response) => response.data);
};

//Agrega Comentario un paciente
const putPacientComment = (dni, comment) => {
  const config = {
    headers: {
      Authorization: token,
    },
  };

  const request = axios.put(
    `${baseUrl}/add-new-comment/${dni}`,
    comment,
    config
  );

  return request.then((response) => response.data);
};

//Crea nuevo Paciente
const postNewPacient = (newPacient) => {
  const config = {
    headers: {
      Authorization: token,
    },
  };

  const request = axios.post(baseUrl, newPacient, config);

  return request.then((response) => response.data);
};

//Edita info de Paciente
const editPacientInfo = (dni, newInfo) => {
  const config = {
    //Enviamos por header el token
    headers: {
      Authorization: token,
    },
  };

  const request = axios.put(`${baseUrl}/edit-info/${dni}`, newInfo, config);

  return request.then((response) => response.data);
};

//Actualiza el estado del diagnóstico
const closeDiagnosisPacient = (dni, newState) => {
  const config = {
    //Enviamos por header el token
    headers: {
      Authorization: token,
    },
  };

  const request = axios.put(
    `${baseUrl}/update-state-diagnosis/${dni}`,
    newState,
    config
  );

  return request.then((response) => response.data);
};

export {
  getAllPacients,
  getPacientByDni,
  putPacientComment,
  putPacientDiagnosis,
  postNewPacient,
  editPacientInfo,
  getPacientLogByDni,
  closeDiagnosisPacient,
};
