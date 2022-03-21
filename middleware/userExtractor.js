const jwt = require('jsonwebtoken');

module.exports =  (request, response, next) =>{
  const authorization = request.get('authorization');    
  let token = '';
  
  if(authorization && authorization.toLocaleLowerCase().startsWith('bearer')){
    token = authorization.substring(7);
  }

  let decodedToken = {};
  
  decodedToken = jwt.verify(token,process.env.SECRET);    

  if (!token || !decodedToken.id){
    return response.status(401).json({error: 'token missing or invalid'});
  }

  const {id : userId} = decodedToken;

  request.userId = userId;

  next();
};