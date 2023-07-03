const socket = io('http://localhost:8000');

const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector('.container');
const userList = document.querySelector('.namelist');

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
    socket.emit('send', name_user, message, roomName );
    messageInput.value='';
});

// const name_ofuser = prompt('Enter Your Name to join');
socket.emit('new-user-joined', name_user, roomName );

socket.on('user-joined', (name) => {
    append(`${name} joined the chat`,'center');
    // const userElement = document.createElement('p');
    // userElement.innerText = name;
    // userElement.classList.add('name');
    // userList.appendChild(userElement);
});

socket.on('receive', (data) => {
    append(`${data.name}: ${data.message}`, 'left');
});

socket.on('leave', name => {
    append(`${name} left the chat`,'left');
});