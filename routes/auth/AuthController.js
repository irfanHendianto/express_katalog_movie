const {Account} = require('../../models/account');
const {Profile} = require('../../models/profile');
const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('../../utils/nodemailer.js');
const redis_client = require('../../utils/redis_connection');
const {validationInputRegister} = require('../../utils/validation');
const {generateJWTToken,GenerateRefreshToken} = require('../../utils/HelperJWTToken');


const register = async (req,res,next) =>{
    // Check Email And Password

    let check_Input = {
        name: req.body.name,
        place_Of_Birth: req.body.place_Of_Birth,
        date_Of_Birth:req.body.date_Of_Birth,
        email: req.body.email,
        password: req.body.password,
        confirm_Password: req.body.confirm_Password

    };

    const {error} = validationInputRegister(check_Input);
    if(error) return res.status(400).send({status:400, message: error.details[0].message});

    //Check email and password
    const check_Email = await Account.findOne({email: req.body.email});
    if(check_Email) res.status(400).send({status:400, message: "Email Already Exist !"});
   
    // // HASH PASSWORD
    const salt = await bcryptjs.genSalt(10);
    const hashPassword = await bcryptjs.hash(req.body.password, salt);

    // data 0 user autiomation become admin
    const checkUsers = await Account.find().countDocuments();
    let admin  = false;
    checkUsers === 0 ? admin  = true : admin = false;

    let account = new Account(
        {
            email:req.body.email,
            password:hashPassword,
            admin: admin,
            status: 1,
            status_account: false
        }
    );
    let profile = new Profile ({
        name:req.body.name,
        place_Of_Birth:req.body.place_Of_Birth,
        date_Of_Birth: req.body.date_Of_Birth,
        account_Id: account._id
    })
    try {
        await account.save(); 
        await profile.save();
        const token = await jwt.sign(
            {
                account_id:account._id
            },
            process.env.TOKEN_SECRET,
            {
                expiresIn: '1d'
            }
        )
        const url = `http://localhost:8080/api/auth/active/${token}`
        nodemailer.sendMail({
            from: "dev-test231@outlook.com",
            to: req.body.email,
            subject: "Confirm Email",
            html: `Please click this email to confirm your email  : <a href="${url}">${url} </a>`

        },function (error, response) {
            if (error) {
                console.log(error);
                callback(error);
            }
        })

        res.status(200).json({
            message: 'success !',
            account_id : account._id
        });

    } catch (error) {
        res.status(400).send({
            status:400,
            message: error.message || "Error during store data"
        });
    }
  
}


const activeAccount = async (req,res,next) =>{
    let {account_id} = await  jwt.decode(req.params.token);
    const idToSearch = mongoose.Types.ObjectId(account_id);
    await  Account.updateOne({_id:idToSearch}, {$set: {"status_account": true}}).
    then(() =>{
        res.status(200).send({
            status: 200,
            message: "Success !"
        })
    }).catch(err => {
        res.status(400).send({
            status: 400,
            message: error.message || "Error during store data"
        })
    })
  
}

const sendEmailActiveAccount = async ( req, res, next) =>{
    const url = `http://localhost:8080/api/auth/active/${req.params.token}`;

    nodemailer.sendMail({
        from: "dev-test231@outlook.com",
        to: req.body.email,
        subject: "Confirm Email",
        html: `Please click this email to confirm your email  : <a href="${url}">${url} </a>`

    },function (error, response) {
        if (error) {
            console.log(error);
            callback(error);
        }
    });
}
const login = async (req,res,next) =>{

    const check_user = await Account.findOne({email: req.body.email});
    if(!check_user) res.status(400).send("Email or password Not Exist !");
    
    const validPass =  await bcryptjs.compare(req.body.password,check_user.password)
    if(!validPass) res.status(400).send("Invalid Password !");
    
    const {name} = await Profile.findOne({account_Id : check_user._id},{name : 1, _id:0});

    const data = {
        _id : check_user._id,
        admin : check_user.admin,
        name : name,
        status_account : check_user.status_account
    }
    const token = generateJWTToken(data);
    const refreshToken = GenerateRefreshToken(data)

    res.header('auth-token').send({
        accesstoken: token,
        refreshToken: refreshToken
    })
   
}

const refreshToken = async (req,res,next) =>{
    const data = {
        _id : req.user._id,
        admin : req.user.admin,
        name : req.user.name,
        status_account : req.user.status_account
    }
    const access_token = generateJWTToken(data);
    const refresh_token = GenerateRefreshToken(data);
    res.header('auth-token').send({
        accesstoken: access_token,
        refresh_token: refresh_token
    })

}

const logout = async (req, res, next) =>{
    const user_id = req.user._id;
    const token = req.token;

    // remove the refresh token
    await redis_client.del(user_id.toString());

    // blacklist current access token
    await redis_client.set('BL_' + user_id.toString(), token);
    
    return res.status(200).send({status: 200, message: "success."});
}

module.exports = {
    register,
    activeAccount,
    login,
    sendEmailActiveAccount,
    refreshToken,
    logout

}