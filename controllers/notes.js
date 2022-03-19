const notesRouter = require('express').Router();
const Note = require('../models/Note');

notesRouter.post('/', async (request,response)=>{
  const {body} = request; 
  const{content,date,important} = body;

  const notes = new Note({
    content,
    date,
    important
    
  });

  const savedNotes = await notes.save();

  response.json(savedNotes);

});

// notesRouter.get('/', async (request, response) => {
//   //arreglo para el timeout en la promesa
//   // await (new Promise(resolve => setTimeout(resolve, 3000))); 
//   // Note.find({}).then(notes=>{    
//   const notes = await Note.find({});  
//   response.json(notes);
// });

// });


// //para que los errores que son frecuentes no salga el 404 ocupar midelware
// notesRouter.get('/:id', (request, response,next) => {
//   const {id} = request.params;
//   Note.findById(id).then(note=>{
//     note ? response.json(note) : response.status(404).end();
//   }).catch(err => {
//     // console.error(err);
//     // response.status(400).end();
//     next(err);
//   });
// });

// notesRouter.put('/:id', (request, response,next) => {

//   const {id} = request.params;
//   const note = request.body;
 
//   const newNoteInfo = {
//     content: note.content,
//     important:note.important
//   };
//   Note.findByIdAndUpdate(id, newNoteInfo).
//     then(result=>{
//       response.json(result);
//     })
//     .catch(next);
  
// });

// //sin async
// // app.delete('/api/notes/:id', (request, response,next) => {
// //   const {id} = request.params;  
  
// //   Note.findByIdAndDelete(id)
// //     .then(()=>response.status(204).end())
// //     .catch(next);

// // });
// //con async
// notesRouter.delete('/:id', async (request, response,next) => {
//   const {id} = request.params;  
  
//   await Note.findByIdAndDelete(id)
//     .then(()=>response.status(204).end());
    

// });

// //sin async
// // app.post('/api/notes', (request, response,next) => {
// //   const note = request.body;

// //   if (!note.content)return(response.status(400).json({ error: 'required content is missing' }));
// //   const newNote = new Note({ 
// //     content: note.content,
// //     important: note.important || false, 
// //     date: new Date(),
// //   }); 

// //   newNote.save().then(savedNote =>{
// //     response.json(savedNote);
// //   }).catch(err=>next(err));
  
// // });

// //con async
// notesRouter.post('/', async (request, response,next) => {
//   const note = request.body;

//   if (!note.content)return(response.status(400).json({ error: 'required content is missing' }));
//   const newNote = new Note({ 
//     content: note.content,
//     important: note.important || false, 
//     date: new Date(),
//   }); 

//   try {
//     const savedNote = await newNote.save();
//     response.json(savedNote);    
//   } catch (error) {
//     next(error);
//   }
// });

module.exports = notesRouter;
