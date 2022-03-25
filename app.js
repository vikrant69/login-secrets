require('dotenv').config();  // this line should be put on top to cnofig env
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const md5 = require('md5');

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect('mongodb://0.0.0.0:27017/userDB');

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

const User = mongoose.model('User', userSchema);

console.log(md5('V8k4a!5#123'));

app.get('/', (req, res)=>{
    res.render('home');
});

app.get('/login', (req, res)=>{
    res.render('login');
});

app.get('/register', (req, res)=>{
    res.render('register');
});


app.post('/register', (req, res)=>{
    const newUser = new User({
        email: req.body.username,
        password: md5(req.body.password)
    });

    newUser.save((err)=>{
        if(err)console.log(err);
        else{
            res.render('secrets');
        }
    })
});

app.post('/login', (req, res)=>{
    const username = req.body.username;
    const password = md5(req.body.password);

    User.findOne({email: username}, (err, foundUser)=>{
        if(err)console.log(err);
        else{
            if(foundUser){
                if(password === foundUser.password){
                    res.render('secrets');
                }
            }
        }
    });
});


app.listen(3000, ()=>{
    console.log('Server is running on port 30000');
});