const {Comment} = require('../../models/comment');
const {Movie} = require('../../models/movie');
const mongoose = require('mongoose');


const addComment = async (req,res,next) =>{
    let query = {"_id": req.params.id_Movie}
    comment = new Comment ({
        account:req.body.account,
        text: req.body.text
    });

    try {
        comment.save()
        .then(result => {
            Movie.findByIdAndUpdate( query ,{ $push: { commnet: result._id } }).
            then(()=>{
                res.status(200).send({
                    status:200,
                    message:"Success !!"
                })
            })

        });

    } catch (error) {
        res.status(400).send({
            status:400,
            message: error.message
        })
    }
}

const updateComment = async (req,res,next) =>{
    let query = {"_id": req.params.id_comment}
    try {
        Comment.findByIdAndUpdate( query ,{$set:{"text":req.body.text}} )
        .then(() =>{
            res.status(200).send({
                status:200,
                message: "Success"
            })
        })
    } catch (error) {
        res.status(400).send({
            status:400,
            message: error.message
        })
    }
}

const deleteComment = async (req,res,next) =>{
    let query = {"_id": req.params.id_comment}
    try {
        Movie.findByIdAndUpdate({"_id": req.params.id_Movie},{$pull: {commnet: req.params.id_comment}}, {multi: true})
        .then(()=>{
            Comment.findByIdAndDelete( query, {new:true} )
            .then(() =>{
                res.status(200).send({
                    status:200,
                    message: "Success"
                })
            })
        });
    } catch (error) {
        res.status(400).send({
            status:400,
            message: error.message
        })
    }
}

module.exports = {
    addComment,
    updateComment,
    deleteComment
}