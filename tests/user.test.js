const bcrypt = require('bcrypt');
const User = require('../models/User');
const mongoose  = require('mongoose');
const {api,getUsers} = require('./helpers');

describe('creating a new user', () =>{
  beforeEach(async() =>{
    await User.deleteMany({});
    const passwordHash = await bcrypt.hash('pass',10);
    const user = new User({
      username:'oliuwu',
      passwordHash  
    });
    await user.save();    
  });

  test('works as expected creating a fresh username', 
    async() =>{      
      const usersAtStart = await getUsers();
      const newUser = {
        username:'oliuwu2',
        name: 'guaguita oli2',
        password: '123'
      };
      await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/);
      
      const usersAtEnd = await getUsers();

      expect(usersAtEnd).toHaveLength(usersAtStart.length+1);

      const usernames = usersAtEnd.map((u) => u.username);
      expect(usernames).toContain(newUser.username);
    });

  test('creation fails with proper statuscode and message if username is already taken',async () =>{
    const usersAtStart = await getUsers();

    const newUser = {
      username:'oliuwu',
      name: 'guaguita oli',
      password: '121231233'
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);
    
    expect(result.body.errors.username.message).toContain('`username` to be unique');
    const usersAtEnd = await getUsers();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
       

  },10000);

}); 

afterAll(async() => await mongoose.disconnect());