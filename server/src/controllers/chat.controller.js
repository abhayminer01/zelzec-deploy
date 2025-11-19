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



module.exports = {
    startChat
};
