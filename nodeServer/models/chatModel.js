const mongoose = require('mongoose');

const dbURI = 'mongodb+srv://ritesh:jishu%40786@cluster0.emgnm5g.mongodb.net/conversa?retryWrites=true&w=majority'
mongoose.connect(dbURI)
    .then((result) => {
        console.log('connected to db');
    })
    .catch((err) => {console.log(err)});

const Schema = mongoose.Schema;

const chatSchema = new Schema({
    name:{
        type:String,
    },
    message:{
        type:String,
    },
    house:{
        type:String,
    }
},{timestamps: true});

const Chats =mongoose.model('Chat',chatSchema);
module.exports = Chats;
