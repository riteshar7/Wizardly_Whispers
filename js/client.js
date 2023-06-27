const socket = io('http://localhost:8000');

const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector('.container');

const name_ofuser = prompt('Enter Your Name to join');
socket.emit('new-user-joined', name_ofuser);
