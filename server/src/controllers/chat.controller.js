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
        const { chatId } = req.params;

        // 1. Validate chat exists
        const chat = await Chat.findById(chatId)
            .populate("sender", "full_name email avatar")
            .populate("product", "user title")
            .populate({
                path: "product",
                populate: {
                    path: "user",
                    select: "full_name email avatar"
                }
            });

        if (!chat) {
            return res.status(404).json({
                success: false,
                message: "Chat not found"
            });
        }

        // 2. Authorization check: only buyer or seller can view
        const isSender = String(chat.sender._id) === String(req.user._id);
        const isOwner = String(chat.product.user._id) === String(req.user._id);

        if (!isSender && !isOwner) {
            return res.status(403).json({
                success: false,
                message: "Not allowed to view this chat"
            });
        }

        // 3. Fetch all messages for this chat
        const messages = await Message.find({ chatId })
            .populate("sender", "full_name email avatar")
            .sort({ createdAt: 1 }); // oldest → newest

        res.status(200).json({
            success: true,
            chat,
            messages
        });

    } catch (error) {
        console.log("💥 GET CHAT HISTORY ERROR:", error);
        res.status(500).json({ success: false, err: error.message });
    }
};

// Add to chat.controller.js
const getMyChats = async (req, res) => {
    try {
        const userId = req.user._id;

        // Find all chats where user is sender OR product owner
        const chats = await Chat.find({
            $or: [
                { sender: userId },
                { 'product.user': userId }
            ]
        })
        .populate('sender', 'full_name email avatar')
        .populate({
            path: 'product',
            populate: {
                path: 'user',
                select: 'full_name email avatar'
            }
        })
        .sort({ updatedAt: -1 }); // Latest first

        // Fetch latest message for each chat
        const chatsWithPreview = await Promise.all(chats.map(async (chat) => {
            const latestMessage = await Message.findOne({ chatId: chat._id })
                .sort({ createdAt: -1 })
                .select('text createdAt');
            return {
                ...chat.toObject(),
                latestMessage: latestMessage?.text || 'No messages yet',
                lastMessageAt: latestMessage?.createdAt || chat.createdAt
            };
        }));

        res.status(200).json({
            success: true,
            chats: chatsWithPreview,
            currentUserId: userId
        });

    } catch (error) {
        console.error("Get my chats error:", error);
        res.status(500).json({ success: false, err: error.message });
    }
};


module.exports = {
    startChat,
    sendMessage,
    getChatHistory,
    getMyChats
};
