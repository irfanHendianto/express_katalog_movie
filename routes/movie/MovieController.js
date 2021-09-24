const {Movie} = require('../../models/movie');
const mongoose = require('mongoose');
const cloudinary = require('../../utils/cloudinary');


const addMovie = async (req,res,next) =>{
     if(!req.user.admin) {
        return res.status(403).json({
            message: 'you are not an admin'
        })
    }
    try {
        const uploadBanner = await cloudinary.uploader.upload(req.file.path);
        const movie = new Movie({
            movie_name: req.body.movie_name,
            director: req.body.director,
            description: req.body.description,
            totalRate:0,
            totalVoted:0,
            rate:0,
            category: req.body.category,
            commnet:[],
            banner: uploadBanner.secure_url,
            cloudinary_Id: uploadBanner.public_id,
        })

        movie.save()
        .then((result =>{
            res.status(200).send({
                status:200,
                message: result
            })
        }))
    } catch (error) {
        res.status(400).send({
            status:400,
            message : error.message || "Error During Proses"
        })
    }
}

const getAllMovie = async (req,res,next) =>{
   const currentPage = +req.query.page || 1;
   const perPage = +req.query.perPage || 2;
   let totalItems;

   Movie.find()
   .countDocuments()
   .then(count =>{
       totalItems = count;
       return Movie.find({},{movie_name:1,director:1,rate:1,totalVoted:1}).populate({ path: 'category', select: 'nama_Category' })
       .skip((currentPage - 1) * perPage)
       .limit(perPage)
   })
   .then(result => {
       res.status(200).send({
           status:200,
           totalData: totalItems,
           data: result,
           page: currentPage,
           perPage: perPage
       });
   })
   .catch(err =>{
        res.status(400).send({
            status:400,
            message : err.message || "Error During Proses"
        })
   })

}

const giveRating = async (req,res,next) =>{
    const idToSearch = mongoose.Types.ObjectId(req.params.id);

    const movie =  await Movie.find({_id:idToSearch},{rate:1,totalVoted:1,totalRate:1});
    const totalRate = movie[0].totalRate + +req.body.rate
    const totalVoted = movie[0].totalVoted + 1;
    const rate = (totalRate/totalVoted).toFixed(1)

    try {
        Movie.updateOne({_id:idToSearch}, {$set: {"totalRate": totalRate, totalVoted: totalVoted,"rate": rate}})
        .then(()=>{
            res.status(200).send({
                status:200,
                message:"Sucess !!"
            });
        })
    } catch (error) {
        res.status(400).send({
            status:400,
            message : error.message || "Error During Proses"
        })
    }
 
 }
 

 const search = async (req,res,next) =>{
    const { Search } = req.query;

    // Movie.find(
    //     { $text: { $search: "/shang/",$caseSensitive: false, $diacriticSensitive: false} },
        
    //     { score: { $meta: "textScore" } }
    // )
    //     .sort({ score: { $meta: "textScore" } })
    //     .exec(function (error, results) {
    //         if (error) return res.status(400).send(error);
    //         res.status(200).json({ results });
    //     });

   Movie.find( { $or: [ { movie_name: { '$regex' : Search, '$options' : 'i' } }, { director: { '$regex' : Search, '$options' : 'i' }  },  { description: { '$regex' : Search, '$options' : 'i' }  } ] } )
   .then((result) =>{
       res.status(200).send({
           status:200,
           data: result
       })
   }).catch(err =>{
        res.status(400).send({
            status:400,
            message : error.message || "Error During Proses"
        })
   })
   
 }

 const updateDataMovie = async (req,res,next) =>{
    if(!req.user.admin) {
       return res.status(403).json({
           message: 'you are not an admin'
       })
   }
   let {cloudinary_Id,banner} = await Movie.findOne({_id: req.params.id},{cloudinary_Id:1,banner:1,_id:0});
   let image = req.file || "";
   let  uploadBanner;
   let query = {"_id": req.params.id};
   if(image){ 
        let delete_Banner = await cloudinary.uploader.destroy(cloudinary_Id);
        uploadBanner = await cloudinary.uploader.upload(image.path);
    }else {
        uploadBanner = {
            secure_url : banner,
            cloudinary_Id : cloudinary_Id
        }
    }
    const movie = {
        movie_name: req.body.movie_name,
        director: req.body.director,
        description: req.body.description,
        category: req.body.category,
        banner: uploadBanner.secure_url,
        cloudinary_Id: uploadBanner.public_id,
    }

    Movie.findByIdAndUpdate(query, {$set: movie}, {new:true}, function (err,data){
        if(!err){
            res.status(200).json({
                message: 'success !',
            });
        }else{
            res.send(err)
        }
    });
}

const deleteDataMovie = async (req,res,next) =>{
    if(!req.user.admin) {
        return res.status(403).json({
            message: 'you are not an admin'
        })
    }
    let query = {"_id": req.params.id}

    Movie.findByIdAndDelete(query, {new:true}, async (err,data) =>{
        if(!err){
            console.log(data.cloudinary_Id)
            let delete_Banner = await cloudinary.uploader.destroy(data.cloudinary_Id);
            res.status(200).json({
                message: 'success !',
            });
        }else{
            res.send(err)
        }
    });
}


const getDetailMovie = async (req,res,next) =>{
    const currentPage = +req.query.page || 1;
    const perPage = +req.query.perPage || 5;
    const idToSearch = mongoose.Types.ObjectId(req.params.id)
    Movie.aggregate([
        { $match : {_id: idToSearch}},
        {
          $lookup: {
            from: "category_movies",
            localField: "category",
            foreignField: "_id",
            as: "category",
          },
        },

        {$lookup:{
            from: "comments",
            let: {"commnet":"$commnet"},
            pipeline:[
              {$match:{$expr:{$in:["$_id","$$commnet"]}}},
              {$skip:(currentPage-1) * perPage},
              {$limit:perPage}
            ],
            as: "commnet"
         }},
      ])
        .then((result) => {
            res.json({
                data: result
            })
        })
        .catch((error) => {
            res.send(error)
        });
}


module.exports = {
    addMovie,
    getAllMovie,
    giveRating,
    search,
    updateDataMovie,
    deleteDataMovie,
    getDetailMovie
}