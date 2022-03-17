const mongoose = require('mongoose');

const {MONGO_CONNECTION_STRING,MONGO_DB_URI_TEST,NODE_ENV} = process.env;
const connectionString = NODE_ENV === 'test'
  ? MONGO_DB_URI_TEST
  : MONGO_CONNECTION_STRING;
// console.log(NODE_ENV);
// console.log(connectionString);
//conexion mongodb://
mongoose.connect(connectionString)
  .then(() => {
    console.log('Database connected');
  }).catch(err => {
    console.error(err);
  });

process.on('uncaughtException', () => {
  mongoose.connection.disconnect();
});









