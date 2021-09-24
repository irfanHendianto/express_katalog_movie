const express = require('express');
const router = express.Router();
const {register,activeAccount,login,sendEmailActiveAccount} = require('./AuthController')

router.post('/register',register)
router.get('/active/:token',activeAccount)
router.post('/login',login)
router.get('/sendemailactivated/:token',sendEmailActiveAccount)


module.exports = router