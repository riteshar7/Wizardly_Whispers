const joi = require('@hapi/joi');

const schema = {
    user: joi.object({
        name: joi.string().min(4).max(30).required(),
        password: joi.string().pattern(new RegExp("^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$")).required(),
    })
};

module.exports = schema;