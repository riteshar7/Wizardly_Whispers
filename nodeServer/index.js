// This is the Node Server which will handle our Socket IO connections
// const http = require('http');
// const server = http.createServer();

const express = require('express');
const UserLogin = require('./models/userModel');

const app = express();

const server = app.listen(8000);

const io = require('socket.io')(server,{
    cors: {
        origin: '*',
    }
});

app.use(express.urlencoded({extended: true}));
app.set('view engine', 'ejs');

const users = {};

io.on('connection', (socket) => {
    socket.on('new-user-joined', (name) => {
        console.log(name,'joined');
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
        console.log(users);
    });
    socket.on('send', (message) => {
        socket.broadcast.emit('receive', {message: message, name: users[socket.id]});
    });

    socket.on('disconnect', (message) => {
        socket.broadcast.emit('leave', users[socket.id]);
        delete users[socket.id];
    });
});

app.get('/signup',(req, res) => {
    res.render('signup');
});

app.get('/',(req, res) => {
    res.render('login');
});

app.get('/login',(req, res) => {
    res.redirect('/');
})

app.post('/signup',async(req, res) => {
    const data = new UserLogin(req.body);
    // const data = {
    //     name: req.body.name,
    //     password: req.body.password
    // }
    // UserLogin.insertMany([data]);
    await data.save()
        .then((result) => {
            res.render('home');
        })
        .catch((err) => {
            console.log(err);
        });
});

app.post('/login',async(req, res) => {
    try{
        const check = await UserLogin.findOne({name:req.body.name});
        if(check.password==req.body.password){
            res.render('home');
        }
        else{
            console.log('Wrong Password');
        }
    }
    catch{
        console.log('Wrong Credintials');
    }
});

app.post('/home',(req, res) => {
    try{
        res.render('index');
    }
    catch{
        console.log('Error');
    }
});