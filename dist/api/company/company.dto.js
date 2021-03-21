"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const joi = require("joi");
const address_dto_1 = require("../user/address.dto");
const companyCreateValidator = joi.object().keys({
    name: joi.string().required(),
    email: joi.string().email().required(),
    phone: joi.string().required(),
    website: joi.string().allow(null),
    address: address_dto_1.addressSchema,
    established: joi.date().allow(null),
    metricId: joi.string().required(),
    stateLicence: joi.array().items(joi.string()).required(),
    companySize: joi.number().default(1),
    subscriptionType: joi.number().required().valid(...[1, 2]),
    userCount: joi.number().default(5),
});
exports.companyCreateValidator = companyCreateValidator;
const companyUpdateValidator = joi.object().keys({
    name: joi.string(),
    email: joi.string().email(),
    phone: joi.string(),
    website: joi.string().allow(null),
    address: address_dto_1.addressSchema,
    established: joi.date().allow(null),
    metricId: joi.string(),
    stateLicense: joi.array().items(joi.string()),
    companySize: joi.number().default(1),
    subscriptionType: joi.number().valid(...[1, 2]),
    userCount: joi.number().default(5),
});
exports.companyUpdateValidator = companyUpdateValidator;
//# sourceMappingURL=company.dto.js.map