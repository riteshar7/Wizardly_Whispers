// This is the Node Server which will handle our Socket IO connections
// const http = require('http');
// const server = http.createServer();

const express = require('express');
const app = express();

const server = app.listen(8000);

const io = require('socket.io')(server,{
    cors: {
        origin: '*',
    }
});


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
    })
})


