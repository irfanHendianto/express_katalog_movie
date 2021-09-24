const express = require('express');
const router = express.Router();
const verify = require('../../middlewares/verifyToken');
const upload = require('../../utils/multer');
const {addMovie,getAllMovie,giveRating,search,updateDataMovie,deleteDataMovie} = require('./MovieController');

router.post('/',verify,upload.single("image"),addMovie);
router.put('/:id',verify,upload.single("image"),updateDataMovie);
router.delete('/:id',verify,deleteDataMovie);
router.get('/',getAllMovie);
router.put('/rate/:id',verify,giveRating);
router.get('/search',search);



module.exports = router