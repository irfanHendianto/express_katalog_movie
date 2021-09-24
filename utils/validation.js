const Joi = require('@hapi/joi');

const validationInputRegister =  (data)=>{
    const schema = Joi.object({
        name: Joi.string().required(),
        place_Of_Birth: Joi.string().required(),
        date_Of_Birth:Joi.string().required(),
        email: Joi.string().min(6) .required().email(),
        password: Joi.string().pattern(new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$')),
        confirm_Password: Joi.ref('password')  
    });

    return  schema.validate(data)

}

module.exports.validationInputRegister = validationInputRegister
