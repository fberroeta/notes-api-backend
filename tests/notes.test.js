const mongoose  = require('mongoose');

const {server} = require('../index');
const Note = require('../models/Note');
const {api, initialNotes, getAllContentFromNotes } = require('./helpers');

beforeEach(async() => {
  await Note.deleteMany({ });

  //con el for te aseguras que se hagan las promesas en forma secuencial
  for (const note of initialNotes) {
    const noteObject = new Note(note);
    await noteObject.save();
  }
   
  // haria las promesas en paralelo
  // const noteObjects = initialNotes.map(note => new Note(note));
  // const promises = noteObjects.map(note =>note.save());
  // await Promise.all(promises);

  //foreach no puede ser asincrono 

  // initialNotes.forEach (note =>{
  //   const noteObject = new Note(note);
  //   noteObject.save();
  // });
  // const note1 = new Note(initialNotes[0]);
  // await note1.save();

  // const note2 = new Note(initialNotes[1]);
  // await note2.save();
});


//es un metodo asincrono asi que hay que usar async y await. 
//se le pasa un regex para  charset del content-type
describe('Get all notes', () =>{
  test('note are returned as json', async () => {
    await api
      .get('/api/notes')
      .expect(200)
      .expect('Content-Type', /application\/json/);
    
  
  });
  
  test('there are 2 notes', async () => {
    const response = await api.get('/api/notes');
    expect(response.body).toHaveLength(initialNotes.length);
  
  });
  
  test('first note is about guaguita oli', async () => {
    const response = await api.get('/api/notes');
    expect(response.body[0].content).toBe('Hola soy la guaguita oli');
     
  });
  
  test('a note is about guaguita oli', async () => {
    const {contents} = await getAllContentFromNotes();
    expect(contents).toContain('y estoy sucia');
     
  });
});


describe('create a note', () => {
  test('w/a valid note can be added', async () => {
    const newNote = {
      content: 'De nuevo soy yo y estoy enojada', 
      important:true
    };
  
    await api
      .post('/api/notes')
      .send(newNote)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const {contents,response} = await getAllContentFromNotes();
  
    expect(response.body).toHaveLength(initialNotes.length+1);
    expect(contents).toContain(newNote.content);
  });

  test(' without content is not added', async () => {
    const newNote = {
      important:true
    };
      
    await api
      .post('/api/notes')
      .send(newNote) 
      .expect(400);
    
    const response = await api.get('/api/notes');
    expect(response.body).toHaveLength(initialNotes.length);
  });

});

describe('delete a note', () => {
  test('a note can be deleted', async () => {
    const {response:firstResponse} = await getAllContentFromNotes();
    const {body:notes} = firstResponse;
    const noteToDelete = notes[0];
    await api
      .delete(`/api/notes/${noteToDelete.id}`)
      .expect(204);

    const {contents, response:finalResponse} = await getAllContentFromNotes();
    expect(finalResponse.body).toHaveLength(!initialNotes.length?0:initialNotes.length-1);
    expect(contents).not.toContain(noteToDelete.content);
  });

  test('a note that do not exist can not be deleted', async () => {
  
    await api
      .delete('/api/notes/asdasdasdasdad')
      .expect(400);
    const {response} = await getAllContentFromNotes();
    expect(response.body).toHaveLength(initialNotes.length);
  });});



afterAll(() => {
  mongoose.connection.close();
  server.close();
});


