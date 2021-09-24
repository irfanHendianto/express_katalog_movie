const express = require('express');
const router = express.Router();
const verify = require('../../middlewares/verifyToken');
const {addCategory,getAllCategory,editCategory,deleteCategory} = require('./CategoryMovieController');

router.post('/add',verify,addCategory);
router.get('/',getAllCategory);
router.put('/edit/:id',verify,editCategory)
router.delete('/delete/:id',verify,deleteCategory)


module.exports = router