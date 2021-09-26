const express = require('express');
const router = express.Router();
const {verifyToken,verifyRefreshToken} = require('../../middlewares/verifyToken');
const {register,activeAccount,login,sendEmailActiveAccount,refreshToken,logout} = require('./AuthController');

router.post('/register',register);
router.get('/active/:token',activeAccount);
router.post('/login',login);
router.post('/refresh-token',verifyRefreshToken,refreshToken);
router.get('/logout',verifyToken, logout);
router.get('/sendemailactivated/:token',sendEmailActiveAccount);


module.exports = router