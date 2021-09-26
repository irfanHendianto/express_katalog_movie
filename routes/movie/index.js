const express = require('express');
const router = express.Router();
const {verifyToken} = require('../../middlewares/verifyToken');
const upload = require('../../utils/multer');
const {addMovie,getAllMovie,giveRating,search,updateDataMovie,deleteDataMovie,getDetailMovie} = require('./MovieController');

router.post('/',verifyToken,upload.single("image"),addMovie);
router.put('/:id',verifyToken,upload.single("image"),updateDataMovie);
router.delete('/:id',verifyToken,deleteDataMovie);
router.get('/',getAllMovie);
router.put('/rate/:id',verifyToken,giveRating);
router.get('/search',search);
router.get('/:id',getDetailMovie);



module.exports = router