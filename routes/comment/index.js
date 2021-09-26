const express = require('express');
const router = express.Router();
const {verifyToken} = require('../../middlewares/verifyToken');
const {addComment,updateComment,deleteComment} = require('./CommentController');

router.post('/add/:id_Movie',verifyToken,addComment);
router.put('/edit/:id_comment',verifyToken,updateComment)
router.put('/remove/:id_comment/:id_Movie',verifyToken,deleteComment)


module.exports = router