const jwt = require('jsonwebtoken');
const redis_client = require('./redis_connection');

const generateJWTToken = (dataUser)=>{
    return  jwt.sign(dataUser,process.env.TOKEN_SECRET,{expiresIn: process.env.JWT_ACCESS_TIME})

}

const  GenerateRefreshToken = (dataUser) => {
    const refresh_token = jwt.sign(dataUser, process.env.REFRESH_TOKEN, { expiresIn: process.env.JWT_REFRESH_TIME });
    
    redis_client.get(dataUser._id.toString(), (err, data) => {
        if(err) throw err;
        redis_client.set(dataUser._id.toString(), JSON.stringify({token: refresh_token}));
    })

    return refresh_token;
}

module.exports.generateJWTToken = generateJWTToken;
module.exports.GenerateRefreshToken = GenerateRefreshToken
