"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const joi = require("joi");
class Address {
}
exports.Address = Address;
const addressSchema = joi.object().keys({
    street: joi.string().required(),
    city: joi.string().required(),
    zip: joi.number(),
    state: joi.string().required(),
});
exports.addressSchema = addressSchema;
//# sourceMappingURL=address.dto.js.map