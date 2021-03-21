"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const joi = require("joi");
const address_dto_1 = require("./address.dto");
const role_enum_1 = require("../auth/role.enum");
const userValidator = joi.object().keys({
    firstName: joi.string().required(),
    lastName: joi.string().required(),
    email: joi.string().required(),
    password: joi.string().required(),
    role: joi.string().required(),
    phone: joi.string().required(),
    company: joi.string().required(),
    address: address_dto_1.addressSchema.allow(null),
});
exports.userValidator = userValidator;
const userCreateValidator = joi.object().keys({
    firstName: joi.string().required(),
    lastName: joi.string().required(),
    email: joi.string().required(),
    password: joi.string().required(),
    confirm: joi.any().valid(joi.ref('password')).required(),
    role: joi.string().default(role_enum_1.AuthRole.ADMIN),
    phone: joi.string().required(),
    company: joi.string().allow(null),
    address: address_dto_1.addressSchema.allow(null),
});
exports.userCreateValidator = userCreateValidator;
const userUpdateValidator = joi.object().keys({
    firstName: joi.string(),
    lastName: joi.string(),
    email: joi.string(),
    role: joi.string().default(role_enum_1.AuthRole.ADMIN),
    phone: joi.string().required(),
    company: joi.string(),
    address: address_dto_1.addressSchema.allow(null),
    isActive: joi.boolean(),
    isLocked: joi.boolean(),
    isDeleted: joi.boolean(),
});
exports.userUpdateValidator = userUpdateValidator;
const paginationValidator = joi.object().keys({
    page: joi.number(),
    limit: joi.number(),
    search: joi.string(),
});
exports.paginationValidator = paginationValidator;
//# sourceMappingURL=user.dto.js.map