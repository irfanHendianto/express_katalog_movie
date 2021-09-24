const mongoose = require('mongoose');
const CommentSchema = new mongoose.Schema({
    account: {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'account'
    },
    text : {
        type: String,
        required: true,
    },
},{
    timestamps:true
})
const Comment = mongoose.model('comment', CommentSchema);

module.exports = {Comment}