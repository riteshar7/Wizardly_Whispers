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

app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.set('view engine', 'ejs');

// const users = {};
const rooms = {};

io.on('connection', (socket) => {
    socket.on('new-user-joined', (name, room) => {
        console.log(name,'joined');
        socket.join(room);
        rooms[room].users[socket.id] = name;
        console.log(rooms);
        socket.broadcast.to(room).emit('user-joined', name);
    });
    socket.on('send', (message, room) => {
        socket.broadcast.to(room).emit('receive', {message: message, name: rooms[room].users[socket.id]});
    });

    // socket.on('disconnect', (message) => {
    //     socket.broadcast.emit('leave', rooms[room].users[socket.id]);
    //     delete rooms[room].users[socket.id];
    // });
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

app.get('/:id', (req, res) => {
    res.render('index',{room: req.params.id});
})

app.post('/signup', async(req, res) => {
    // const data = {
    //     name: req.body.name,
    //     password: req.body.password
    // }
    // UserLogin.insertMany([data]);
    const check = await UserLogin.findOne({name:req.body.name});
    if(check){
        res.send('<h3 align= "center">Error!! Username Already Exists</h3>');
    }
    else{
        const data = {
            name: req.body.name,
            password: req.body.password,
            house: req.body.house,
        }
        // const data = new UserLogin(req.body);
        await UserLogin.insertMany([data])
            .then((result) => {
                // res.render('index');
                if(!rooms[data.house]){
                    rooms[data.house] = { users:{} };
                }
                res.redirect(data.house);
            })
            .catch((err) => {
                console.log(err);
            });
    }
});

app.post('/login',async(req, res) => {
    try{
        const check = await UserLogin.findOne({name:req.body.name});
        if(check.password==req.body.password){
            // res.render('index',{house: req.body.house});
            const house = check.house;
            if(!rooms[house]) {
                rooms[house] = { users:{} };
            }
            // console.log(house);
            res.redirect(house);
        }
        else{
            console.log('Wrong Password');
        }
    }
    catch{
        console.log('Wrong Credintials');
    }
});