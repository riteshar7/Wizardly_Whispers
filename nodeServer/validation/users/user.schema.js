const joi = require('@hapi/joi');

const schema = {
    user: joi.object({
        name: joi.string().min(4).max(30).required(),
        password: joi.string().pattern(new RegExp("^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])[A-Za-z0-9]{8,}$")),
        conf_password: joi.string().pattern(new RegExp("^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])[A-Za-z0-9]{8,}$"),),
        house: joi.string(),
    })
};

module.exports = schema;