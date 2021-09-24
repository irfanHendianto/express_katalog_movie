const nodemailer = require("nodemailer");
const configs = require('../config');

module.exports = nodemailer.createTransport({
    service: 'hotmail',
    auth:{
        user: configs.email,
        pass: configs.pass
    }
});
