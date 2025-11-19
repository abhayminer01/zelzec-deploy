const Chat = require("../models/chat.model");
const Message = require("../models/message.model");

const startChat = async (req, res) => {
    try {
        const { productId } = req.body;

        let chat = await Chat.findOne({ product : productId, sender : req.user._id });
        if(!chat) {
            chat = await Chat.create({
                sender : req.user._id,
                product : productId
            });
        }

        res.status(200).json({ success : true, data : chat });
    } catch (error) {
        res.status(500).json({ success : false, err : error });
    }
}

const sendMessage = async (req, res) => {
    try {
        const { chatId, text } = req.body;
        const message = await Message.create({
            sender : req.user._id,
            chatId : chatId,
            text : text
        });

        res.status(200).json({ success : true, message : "sent succesfully", data : message });
    } catch (error) {
        res.status(500).json({ success : false, err : error });
    }
}

const getChatHistory = async (req, res) => {
    try {
        const { chatId } = req.body;
        
    } catch (error) {
        res.status(500).json({ success : false, err : error });
    }
}

module.exports = {
    startChat,
    sendMessage
};
