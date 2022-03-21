const notesRouter = require('express').Router();
const Note = require('../models/Note');
const User = require('../models/User');
const userExtractor = require('../middleware/userExtractor');
// notesRouter.post('/', async (request, response) => {
//   const { body } = request;
//   const { content, date, important } = body;

//   const notes = new Note({
//     content,
//     date,
//     important,
//   });

//   const savedNotes = await notes.save();

//   response.json(savedNotes);
// });

notesRouter.get('/', async (request, response) => {
  
  const notes = await Note.find({}).populate('user',
    {
      username:1,
      name:1
    }
  );
  response.json(notes);
});

// });

// //para que los errores que son frecuentes no salga el 404 ocupar midelware
notesRouter.get('/:id', (request, response, next) => {
  const { id } = request.params;
  Note.findById(id)
    .then((note) => {
      note ? response.json(note) : response.status(404).end();
    })
    .catch((err) => {
      // console.error(err);
      // response.status(400).end();
      next(err);
    });
});

notesRouter.put('/:id', userExtractor,(request, response, next) => {
  const { id } = request.params;
  const note = request.body;

  const newNoteInfo = {
    content: note.content,
    important: note.important,
  };
  Note.findByIdAndUpdate(id, newNoteInfo)
    .then((result) => {
      response.json(result);
    })
    .catch(next);
});

notesRouter.delete('/:id', userExtractor, async (request, response, next) => {
  const { id } = request.params;

  await Note.findByIdAndDelete(id).then(() => response.status(204).end());
});
  
  
notesRouter.post('/', userExtractor, async (request, response,next) => {
  const { 
    content,
    important=false
    
    
  } = request.body;

  // sacar userID de request
  const {userId} = request;
  const user = await User.findById(userId);

  if (!content)
    return response.status(400).json({ 
      error: 'required "content" field is missing' 
    });

  const newNote = new Note({
    content,
    date: new Date(),
    important,
    user: user._id
  });
  
  
  
  try {
    const savedNote = await newNote.save();
  
    user.notes = user.notes.concat(savedNote._id);
    await user.save();
  
    response.json(savedNote);
  } catch (error) {
    next(error);
  }
});

module.exports = notesRouter;
