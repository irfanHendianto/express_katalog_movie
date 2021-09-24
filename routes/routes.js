const express = require('express');
const router = express.Router();
const auth = require('./auth');
const category = require('./category');
const movie = require('./movie');
const comment = require('./comment');
const { Router } = require('express');



 // Auth
router.use('/auth',auth);

// Category
router.use('/category',category);

// Movie
router.use('/movie',movie);

// Comment 
router.use('/comment',comment);





module.exports = {
    routes: router
}