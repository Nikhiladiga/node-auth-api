const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
require('dotenv/config');

const app = express();

//DATABASE CONNECTION
mongoose.connect(process.env.DB_CONNECTION, {useNewUrlParser: true},()=>
{
    console.log("Connected to database");
});


//IMPORT ROUTES
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
 

//ROUTE MIDDLEWARES
app.use('/api/user',authRoute);
app.use('/api/posts',postRoute);

app.get('/',(req,res)=>{
    res.send('home');
});


app.listen(5000,()=>{
    console.log("Server started");
})