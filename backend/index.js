//importo variables de entorno y base de datos
require('dotenv').config();
require('./mongo');

//Importo Express y declaro que la app va a ser de ese tipo.
const express = require('express');
const app = express();
//abre las conexiones a cualquier origen
const cors = require('cors');
require('dotenv').config();

const notFound = require('./middleware/notFound');
const handleErrors = require('./middleware/handleErrors');
const diagnosisRouter = require('./controllers/diagnosis');
const pacientsRouter = require('./controllers/pacients');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
const medicos_matriculadosRouter = require('./controllers/medicos_matriculados');
const logsRouter = require('./controllers/logs');

app.use(cors());
app.use(express.json());

app.get('/', (request, response) => {
  response.send('<h1>Welcome to RegMed API</h1>');
});




//Indicamos las distintas direcciones donde la app va a buscar
//la información (controladores)
app.use('/api/diagnosis', diagnosisRouter);
app.use('/api/pacients', pacientsRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);
app.use('/api/medicosmatriculados', medicos_matriculadosRouter);
app.use('/api/logs', logsRouter);

app.use(notFound);
app.use(handleErrors);

const PORT = process.env.PORT;

//Indicamos que la base de datos está funcionando

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});
