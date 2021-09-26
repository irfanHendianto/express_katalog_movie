const express = require('express');
const router = express.Router();
const {verifyToken} = require('../../middlewares/verifyToken');
const {addCategory,getAllCategory,editCategory,deleteCategory} = require('./CategoryMovieController');

router.post('/add',verifyToken,addCategory);
router.get('/',getAllCategory);
router.put('/edit/:id',verifyToken,editCategory)
router.delete('/delete/:id',verifyToken,deleteCategory)


module.exports = router