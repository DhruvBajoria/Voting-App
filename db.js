const mongoose = require("mongoose");
const dotenv = require('dotenv');

dotenv.config();

//define mongodb connection URL
// const mongoURL = process.env.DB_URL_LOCAL;

const mongoURL = process.env.DB_URL;

//set up mongodb connection
mongoose.connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

db.on("connected", () => {
  console.log("connected to mongodb server");
});

db.on('error',(err)=>{
      console.log(err);
});
db.on('disconnected',(err)=>{
      console.log('Mongodb server disconnected')
})

module.exports = db;
