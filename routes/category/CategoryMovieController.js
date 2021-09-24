const {Category_Movie} = require('../../models/categoryMovie');
const mongoose = require('mongoose');


const addCategory = async (req,res,next) =>{
     if(!req.user.admin) {
        return res.status(403).json({
            message: 'you are not an admin'
        })
    }

    try {
        const category_movie = new Category_Movie({
            nama_Category : req.body.nama_Category
        })
        category_movie.save()
        .then((result) =>{
            res.status(200).send({
                status:200,
                message: result
            })
        })

    } catch (error) {
        res.status(400).send({
            status:400,
            message : error.message || "Error During Proses"
        })
    }
}

const getAllCategory = async (req,res,next) =>{
   try {
       Category_Movie.find({}).then(result =>{
           res.status(200).send({
               status:200,
               data: result,
               message: "Success"
           })
       })
   } catch (error) {
        res.status(400).send({
            status:400,
            message : error.message || "Error During Proses"
        })
   }
}

const editCategory = async (req,res,next) =>{
    if(!req.user.admin) {
       return res.status(403).json({
           message: 'you are not an admin'
       })
   }
   try {
    const idToSearch = mongoose.Types.ObjectId(req.params.id)
    await  Category_Movie.updateOne({_id:idToSearch}, {$set: {"nama_Category": req.body.nama_Category}})
    .then(() =>{
        res.status(200).send({
            status:200,
            message: "Success"
        })
    })

   } catch (error) {
       res.status(400).send({
           status:400,
           message : error.message || "Error During Proses"
       })
   }
}

const deleteCategory = async (req,res,next) =>{
    if(!req.user.admin) {
        return res.status(403).json({
            message: 'you are not an admin'
        })
    }
    let query = {"_id": req.params.id}

    Category_Movie.findByIdAndDelete(query, {new:true}, async (err,data) =>{
        if(!err){
            res.status(200).json({
                status:200,
                message: 'success !',
            });
        }else{
            res.status(400).send({
                status:400,
                message:err.message || "Error during process"
            })
        }
    });
}


module.exports = {
    addCategory,
    getAllCategory,
    editCategory,
    deleteCategory
}