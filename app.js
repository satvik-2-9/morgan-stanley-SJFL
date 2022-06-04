const express = require('express');
const res = require('express/lib/response');
const app = express();

app.use(express.json());
app.use(express.urlencoded());


// we can start with a standard running server

console.log('we are running an express modele !');


app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin');
});

