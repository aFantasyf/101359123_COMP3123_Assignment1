const mongoose = require('mongoose')

const usersSchema = new mongoose.Schema({
    _id:{
        type:Number
    },
    
    userName:{
        type:String
    },

    email:{
        type:String,
        unique:true
    },

    password:{
        type:String
    }
})

const User = mongoose.model('User', usersSchema);

module.exports = User;