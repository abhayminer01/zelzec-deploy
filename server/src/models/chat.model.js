const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    participants : [{ type : mongoose.Schema.Types.ObjectId, ref : "User" }],
    product : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : 'Product'
    }
}, { timestamps : true });

const Chat = mongoose.model('Chat', chatSchema);
module.exports = Chat;