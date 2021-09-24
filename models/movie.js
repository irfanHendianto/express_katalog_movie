const mongoose = require('mongoose');
const MovieSchema = new mongoose.Schema({
    movie_name: {
        type: String,
        required: true,
    },
    director : {
        type: String,
        required: true,
    },
    description:{
        type: String,
        required: true,
    },
    totalRate:{
        type:Number,
        required : true
    },
    totalVoted: {
        type:Number,
        required: true,
    },
    rate : {
        type: Number,
        required: true,
    },
    category: [
        { type : mongoose.Schema.Types.ObjectId,
          ref : 'category_Movie'
        }
    ],
    commnet: [
        { type : mongoose.Schema.Types.ObjectId,
          ref : 'comment'
        }
    ],
    banner :{
        type: String,
        required: true,
        
    },
    cloudinary_Id : {
        type: String,
        required: true,
    },  
},{
    timestamps:true
})

MovieSchema.index({ movie_name: "text", director: "text",description: "text" });
const Movie = mongoose.model('movie', MovieSchema);

module.exports = {Movie}