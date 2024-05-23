const express= require('express');
const bodyParser = require('body-parser');
const dotenv=require('dotenv');
const db= require('./db');
dotenv.config();

const app= express();
app.use(bodyParser.json());


const userRoutes = require('./routes/userRoutes');
const candidateRoutes = require('./routes/candidateRoutes');

app.use('/user',userRoutes);
app.use('/candidate',candidateRoutes);


const PORT= process.env.PORT || 3001;
app.listen(PORT,()=>{
      console.log('server is running on port 3001');
})