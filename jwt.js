const jwt = require('jsonwebtoken');

const jwtAuthMiddleware = (req,res,next) =>{
      const authorization = req.headers.authorization;
      if(!authorization){
           return res.status(401).json({message:"You are not aurhorized to use the resource"}); 
      }

      const token = req.headers.authorization.split(' ')[1];
      if(!token)
      return res.status(401).json({message:"Unauthorized"});

      try{
           const decoded = jwt.verify(token,process.env.JWT_SECRET);
           req.user = decoded;
           next(); 
      }catch(err){
            console.error(err);
            return res.status(401).json({error:"Invalid token"});

      }
}

const generateToken = (user) =>{
      return jwt.sign({user},process.env.JWT_SECRET,{expiresIn:"1d"});
}

module.exports = {jwtAuthMiddleware,generateToken};