const Chat = require("../models/chat.model");
const Message = require("../models/message.model");

const startChat = async (req, res) => {
    try {
        const { seller, product } = req.body;

        // Find chat between buyer + seller
        let chat = await Chat.findOne({
            participants: { $all: [req.user._id, seller] },
        });

        // If no chat, create new chat
        if (!chat) {
            chat = await Chat.create({
                participants: [req.user._id, seller],
                product : product
            });
        }

        res.status(200).json({ success: true, chat });
    } catch (error) {
        res.status(500).json({ success: false, error });
    }
};

const sendMessage = async (req, res) => {
    try {
        const { chatId, text } = req.body;

        const message = await Message.create({
            chatId,
            sender: req.user._id,
            text
        });

        res.status(200).json({ success: true, message });
    } catch (error) {
        res.status(500).json({ success: false, error });
    }
};

const getChat = async (req, res) => {
    try {
        const messages = await Message.find({ chatId: req.params.chatId })
            .sort({ createdAt: 1 });

        res.status(200).json({ success: true, messages });
    } catch (error) {
        res.status(500).json({ success: false, error });
    }
};

const getUserChats = async (req, res) => {
    try {
        const chats = await Chat.find({
            participants: req.user._id
        })
        .populate("product", "title images")
        .sort({ updatedAt: -1 });

        res.status(200).json({
            success: true,
            chats
        });
    } catch (error) {
        res.status(500).json({ success: false, error });
    }
};


module.exports = {
    startChat,
    sendMessage,
    getChat,
    getUserChats
};
