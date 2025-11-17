const router = require('express').Router();
const chatController = require('../controllers/chat.controller');

router.post('/start', chatController.startChat);
router.post('/send', chatController.sendMessage);
router.get('/:chatId', chatController.getChat);

module.exports = router;