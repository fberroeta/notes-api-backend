//construir esquema
const {Schema,model} = require('mongoose');

const noteSchema = new Schema({
  content: String,
  date: Date,
  important: Boolean
});

//para arreglar _id y __v y dejar id y v
noteSchema.set('toJSON', {
  transform: (document,returnedObject)=>{
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});
//crear modelo 
const Note = model('Note', noteSchema);

module.exports = Note;


// Note.find({}).then(result=>{
//   console.log(result);
//   mongoose.connection.close();
// });

// const note = new Note({
//   content: 'La guaguita oli esta toda sucia',
//   date: new Date(),
//   important: true
// });

// note.save()
//   .then(result =>{
//     console.log(result);
//     mongoose.connection.close();
//   }).catch(err => {
//     console.error(err);
//   });



