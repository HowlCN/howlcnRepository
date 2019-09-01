const express = require('express')
const user = require('./controller/user')
const bodyParser = require('body-parser')

const app = express();
app.use(bodyParser.urlencoded({extended:false}));


app.use('/',user);

app.listen(8888,()=>{
    console.log('Running On http://localhost:8888');
})