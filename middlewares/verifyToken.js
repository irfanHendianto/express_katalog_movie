const jwt = require('jsonwebtoken');
const redis_client = require('../utils/redis_connection');

function verifyToken (req,res,next){
    const token = req.header('auth-token');
    if(!token) return res.status(400).send("Access Denied");
    
    try {
        const verified = jwt.verify(token,process.env.TOKEN_SECRET)
        req.user = verified;
        req.token = token;

        // varify blacklisted access token.
        redis_client.get('BL_' + verified._id.toString(), (err, data) => {
            if(err) throw err;

            if(data === token) return res.status(401).json({status: false, message: "blacklisted token."});
            next();
        })
    } catch (error) {
        res.status(400).send("Invalid Token");
    }
}

function verifyRefreshToken(req, res, next) {
    const token = req.header('auth-token');
    if(!token) return res.status(401).send({status: 401, message: "Invalid request."});
    try {
        const verified = jwt.verify(token,process.env.REFRESH_TOKEN);
        req.user = verified;
        redis_client.get(verified._id.toString(), (err, data) => {
            if(err) throw err;

            if(data === null) return res.status(401).json({status: 401, message: "Invalid request. Token is not in store."});
            if(JSON.parse(data).token != token) return res.status(401).json({status: 401, message: "Invalid request. Token is not same in store."});

            next();
        })
    } catch (error) {
        res.status(400).send("Invalid Token");
    }
}

module.exports = {
    verifyToken,
    verifyRefreshToken
    
}
