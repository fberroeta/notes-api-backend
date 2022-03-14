const mongoose = require('mongoose');
const connectionString = process.env.MONGO_CONNECTION_STRING;

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









