"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const joi = require("joi");
const credentialsValidator = joi.object().keys({
    email: joi.string().required(),
    password: joi.string().required(),
});
exports.credentialsValidator = credentialsValidator;
const passwordValidator = joi.object().keys({
    current: joi.string().required(),
    password: joi.string().min(6).max(15).required(),
    confirm: joi.any().required().valid(joi.ref('password')).messages({
        'string.base': 'passwords do not match',
        'any.only': 'passwords do not match',
    }),
});
exports.passwordValidator = passwordValidator;
//# sourceMappingURL=auth.dto.js.map