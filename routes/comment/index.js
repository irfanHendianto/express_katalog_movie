const express = require('express');
const router = express.Router();
const verify = require('../../middlewares/verifyToken');
const {addComment,updateComment,deleteComment} = require('./CommentController');

router.post('/add/:id_Movie',verify,addComment);
router.put('/edit/:id_comment',verify,updateComment)
router.put('/remove/:id_comment/:id_Movie',verify,deleteComment)


module.exports = router