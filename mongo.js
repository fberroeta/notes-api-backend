const mongoose = require('mongoose');

const {MONGO_CONNECTION_STRING,MONGO_DB_URI_TEST,NODE_ENV} = process.env;
const connectionString = NODE_ENV === 'test'
  ? MONGO_DB_URI_TEST
  : MONGO_CONNECTION_STRING;
// console.log(connectionString);
//conexion mongodb://
// comment for students puposes
if (!connectionString) {
  console.error('Recuerda que tienes que tener un archivo .env con las variables de entorno definidas y el MONGO_DB_URI que servirá de connection string. En las clases usamos MongoDB Atlas pero puedes usar cualquier base de datos de MongoDB (local incluso).');
}

mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Database connected');
  }).catch(err => {
    console.error(err);
    console.error('asdasdsa');
  });

process.on('uncaughtException', (error) => {
  console.log('error en el servidor '+ error);
  mongoose.disconnect();
});









