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
        io.to(room).emit('user-joined', name);
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

app.get('/:id', async(req, res) => {
    await UserLogin.findById(req.params.id)
            .then((result) => {
                res.render('index',{user: result});
            })
            .catch((err) => {
                console.log(err);
            });
})

app.post('/signup', async(req, res) => {
    // const data = {
    //     name: req.body.name,
    //     password: req.body.password
    // }
    // UserLogin.insertMany([data]);
    const check = await UserLogin.findOne({name:req.body.name});
    if(check){
        res.send('<script>alert("Username Already Exists!")</script>');
    }
    else if(req.body.password!==req.body.conf_password){
        res.send('<script>alert("Password does not match confirmation!")</script>');
    }
    // else{
    //     const data = {
    //         name: req.body.name,
    //         password: req.body.password,
    //         house: req.body.house,
    //     }
    //     // const data = new UserLogin(req.body);
    //     await UserLogin.insertMany([data])
    //         .then((result) => {
    //             // res.render('index');
    //             if(!rooms[data.house]){
    //                 rooms[data.house] = { users:{} };
    //             }
    //             UserLogin.findOne({name: data.name})
    //                 .then((data) => {
    //                     res.redirect(data._id);
    //                 })
    //                 .catch((err) => {
    //                     console.log(err);
    //                 })
    //         })
    //         .catch((err) => {
    //             console.log(err);
    //         });
    // }
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
            res.redirect(check._id);
        }
        else{
            console.log('Wrong Password');
            res.send('<script>alert("Wrong password")</script>');
        }
    }
    catch{
        console.log('Wrong Credintials');
    }
});