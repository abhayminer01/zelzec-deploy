const router = require('express').Router();
const chatController = require('../controllers/chat.controller');
const { userAuthMiddleware } = require('../middlewares/auth.middleware');

router.post('/start', userAuthMiddleware, chatController.startChat);
router.post('/send', userAuthMiddleware, chatController.sendMessage);
router.get('/inbox', userAuthMiddleware, chatController.getUserChats)
router.get('/:chatId', userAuthMiddleware, chatController.getChat);

module.exports = router;
