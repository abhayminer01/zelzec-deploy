const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    chatId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Chat'
    },
    sender : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    text : {
        type : String, 
        required : true
    }
}, { timestamps : true });

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;