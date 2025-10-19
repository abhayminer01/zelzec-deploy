const router = require('express').Router();
const authController = require('../controllers/auth.controller');

router.get('/check', authController.checkAuth);
router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);

module.exports = router;