const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    place_Of_Birth : {
        type: String,
        required: true,
    },
    date_Of_Birth: {
        type: String,
        required: true,
    },
    account_Id :{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'account'
    }
},{
    timestamps: true
})
const Profile = mongoose.model('profile', ProfileSchema);

module.exports = {Profile}