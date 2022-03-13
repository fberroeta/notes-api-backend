const express = require('express');
const app = express();
const cors = require('cors');
const logger = require('./loggerMiddleware');

app.use(cors());
app.use(express.json());

app.use(logger)

let notes = [
  {
    id: 1,
    content: 'Hola soy la guaguita oli',
    date: '2019-05-30T17:30:31.098Z',
    important: true,
  },
  {
    id: 2,
    content: 'qui est esse',
    date: '2019-05-30T17:30:31.098Z',
    important: false,
  },
  {
    id: 3,
    content: 'ea molestias quasi exercitationem repellat qui ipsa sit aut',
    date: '2019-05-30T17:30:31.098Z',
    important: true,
  },
];

// const app = http.createServer((request, response) => {
//   response.writeHead(200, { 'Content-Type': 'application/json' });
//   response.end(JSON.stringify(notes));
// });

app.get('/', (request, response) => {
  response.send('<h1>Hola Fco</h1>');
});

app.get('/api/notes', (request, response) => {
  response.json(notes);
});

app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id);
  const note = notes.find((note) => note.id === id);
  note ? response.json(note) : response.status(404).end();
});

app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id);
  notes = notes.filter((note) => note.id !== id);
  response.status(204).end();
});

app.post('/api/notes', (request, response) => {
  const note = request.body;

  (!note || note.content) ?? 
    response.status(400).json({ error: 'note.content is missing' });

  const ids = notes.map((note) => note.id);
  const maxId = Math.max(...ids);

  const newNote = {
    id: maxId + 1,
    content: note.content,
    important: typeof note.important !== 'undefined' ? note.important : false, //TODO revisar
    date: new Date().toISOString(),
  };

  notes = [...notes, newNote];

  response.status(201).json(newNote);
});

app.use((request,response)=>{
  response.status(404).json({ error: 'Not found'})
})

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
