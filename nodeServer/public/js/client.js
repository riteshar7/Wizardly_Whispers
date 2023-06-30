const socket = io('http://localhost:8000');

const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector('.container');

const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message =messageInput.value;
    append(`Me: ${message}`,'right');
    socket.emit('send', message, roomName );
    messageInput.value='';
});

const name_ofuser = prompt('Enter Your Name to join');
socket.emit('new-user-joined', name_ofuser, roomName );

socket.on('user-joined', (name) => {
    append(`${name} joined the chat`,'right');
});

socket.on('receive', (data) => {
    append(`${data.name}: ${data.message}`, 'left');
});

socket.on('leave', name => {
    append(`${name} left the chat`,'left');
});