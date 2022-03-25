require('dotenv').config();  // this line should be put on top to cnofig env
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');



const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));


// initializing session
app.use(session({
    secret: "abcdefghijklmnopqrstuvwxyz",
    resave: false,
    saveUninitialized: false
}));

// initialize passport
app.use(passport.initialize());
// use passport to setup session
app.use(passport.session());




mongoose.connect('mongodb://0.0.0.0:27017/userDB');

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

// for hashing password
userSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', userSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get('/', (req, res)=>{
    res.render('home');
});

app.get('/login', (req, res)=>{
    res.render('login');
});

app.get('/register', (req, res)=>{
    res.render('register');
});


app.get('/secrets',(req, res)=>{
    if(req.isAuthenticated()){
        res.render('secrets');
    }else{
        res.redirect('/login');
    }
});

app.get('/logout', function(req, res){
    // logout() method comes from passport
    req.logout();
    res.redirect('/');
})

app.post('/register', (req, res)=>{

    // register() method comes from passport
    User.register({username: req.body.username}, req.body.password, (err, user)=>{
        if(err){
            console.log(err);
            res.redirect('/register');
        }else{
            passport.authenticate('local')(req, res, function(){
                res.redirect('/secrets');
            });
        }
    });
});

app.post('/login', (req, res)=>{
    const user = new User({
        username: req.body.username,
        password: req.body.password
    });

    // login() method comes from passport
    req.login(user, function(err){
        if(err){
            console.log(err);
        }else{
            passport.authenticate('local')(req, res, function(){
                res.redirect('/secrets');
            });
        }
    });
});


app.listen(3000, ()=>{

    console.log('Server is running on port 30000');
});