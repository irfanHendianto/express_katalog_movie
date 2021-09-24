const mongoose = require('mongoose');
const Category_MovieSchema = new mongoose.Schema({
    nama_Category: {
        type: String,
        required: true,
    },  
},{
    timestamps:true
})
const Category_Movie = mongoose.model('category_Movie', Category_MovieSchema);

module.exports = {Category_Movie}