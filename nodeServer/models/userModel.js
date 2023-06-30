const mongoose = require('mongoose');

const dbURI = 'mongodb+srv://ritesh:jishu%40786@cluster0.emgnm5g.mongodb.net/conversa?retryWrites=true&w=majority'
mongoose.connect(dbURI)
    .then((result) => {
        console.log('connected to db');
    })
    .catch((err) => {console.log(err)});

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    house:{
        type:String,
        required:true,
    }
},{timestamps:true});

const UserLogin =mongoose.model('User',userSchema);
module.exports = UserLogin;

