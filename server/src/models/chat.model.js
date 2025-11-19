const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    sender : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    product : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : 'Product'
    }
}, { timestamps : true });

const Chat = mongoose.model('Chat', chatSchema);
module.exports = Chat;