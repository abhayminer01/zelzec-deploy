const Chat = require("../models/chat.model");
const Message = require("../models/message.model");

const startChat = async (req, res) => {
    try {
        const { buyer, seller } = req.body;

        let chat = await Chat.findOne({
            participants: { $all: [buyerId, sellerId] }
        });

        if(!chat) {
            chat = await Chat.create({
                participants : [buyer, seller]
            });
        }

        res.status(200).json({ success : true, chat : chat });
    } catch (error) {
        res.status(500).json({ success : false, message : 'Error occured', err : error });
    }
}

const sendMessage = async (req, res) => {
    try {
        const { chatId, sender, text } = req.body;

        const message = await Message.create({
            chatId : chatId,
            sender : sender,
            text : text
        });

        res.status(200).json({ success : true, message });
    } catch (error) {
        res.status(500).json({ success : false, message : 'Error occured', err : error });
    }
}

const getChat = async (req, res) => {
    try {
        const messages = await Message.find({ chatId: req.params.chatId })
            .sort({ createdAt: 1 });

        res.json({ success: true, messages });
    } catch (error) {
        res.status(500).json({ success : false, message : 'Error occured', err : error });
    }
}

module.exports = {
    startChat,
    sendMessage,
    getChat
}