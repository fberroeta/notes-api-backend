require('dotenv').config();
require('./mongo');

const Sentry = require('@sentry/node');
const Tracing = require('@sentry/tracing');
const express = require('express');
const app = express();
const cors = require('cors');
const User = require('./models/User');
const Note = require('./models/Note');

const notFound = require('./middleware/notFound');
const handleErrors = require('./middleware/handleErrors');
const usersRouter = require('./controllers/users');
const notesRouter = require('./controllers/notes');

app.use(cors());
app.use(express.json());
app.use('/images',express.static('images'));

Sentry.init({
  dsn: 'https://a72cfef8915a4ba4922914d19672c0de@o1167412.ingest.sentry.io/6258535',
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Tracing.Integrations.Express({ app }),
  ],
  tracesSampleRate: 1.0,
});

// RequestHandler creates a separate execution context using domains, so that every
// transaction/span/breadcrumb is attached to its own Hub instance
app.use(Sentry.Handlers.requestHandler());
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler());


app.get('/', (request, response) => {
  response.send('<h1>Hola Fco</h1>');
});

app.get('/api/notes', async (request, response) => {
  //arreglo para el timeout en la promesa
  // await (new Promise(resolve => setTimeout(resolve, 3000))); 
  // Note.find({}).then(notes=>{    
  const notes = await Note.find({});  
  response.json(notes);
});

// });


//para que los errores que son frecuentes no salga el 404 ocupar midelware
app.get('/api/notes/:id', (request, response,next) => {
  const {id} = request.params;
  Note.findById(id).then(note=>{
    note ? response.json(note) : response.status(404).end();
  }).catch(err => {
    // console.error(err);
    // response.status(400).end();
    next(err);
  });
});

app.put('/api/notes/:id', (request, response,next) => {

  const {id} = request.params;
  const note = request.body;
 
  const newNoteInfo = {
    content: note.content,
    important:note.important
  };
  Note.findByIdAndUpdate(id, newNoteInfo).
    then(result=>{
      response.json(result);
    })
    .catch(next);
  
});

//sin async
// app.delete('/api/notes/:id', (request, response,next) => {
//   const {id} = request.params;  
  
//   Note.findByIdAndDelete(id)
//     .then(()=>response.status(204).end())
//     .catch(next);

// });
//con async
app.delete('/api/notes/:id', async (request, response,next) => {
  const {id} = request.params;  
  
  await Note.findByIdAndDelete(id)
    .then(()=>response.status(204).end());
    

});

//sin async
// app.post('/api/notes', (request, response,next) => {
//   const note = request.body;

//   if (!note.content)return(response.status(400).json({ error: 'required content is missing' }));
//   const newNote = new Note({ 
//     content: note.content,
//     important: note.important || false, 
//     date: new Date(),
//   }); 

//   newNote.save().then(savedNote =>{
//     response.json(savedNote);
//   }).catch(err=>next(err));
  
// });

//con async
app.post('/api/notes', async (request, response,next) => {

  const 
    {
      content,
      important = false,
      userId
    } = request.body;


  const user = await User.findById(userId);
  if (!content)return(response.status(400).json({ error: 'required content is missing' }));
  const newNote = new Note({ 
    content,
    important, 
    date: new Date(),
    user: user._id
  }); 

  try {
    const savedNote = await newNote.save();

    user.notes = [...user.notes, savedNote._id];
    await user.save();

    response.json(savedNote);    
  } catch (error) {
    next(error);
  }
});

//ROUTER para arreglar el desorden
app.use('/api/users', usersRouter);
app.use('/api/notes', notesRouter);

app.use(notFound);

// The error handler must be before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler());

app.use(handleErrors);


// const PORT = 3001;
const PORT = process.env.PORT || 3001;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


module.exports = {app,server};
// module.exports = {app};