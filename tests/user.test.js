const bcrypt = require('bcrypt');
const User = require('../models/User');
const mongoose  = require('mongoose');
const {api,getUsers} = require('./helpers');

describe.only('creating a new user', () =>{
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
        name: 'guaguita oli',
        username:'oliuwuw',
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

  afterAll(async() => await mongoose.disconnect());
}); 