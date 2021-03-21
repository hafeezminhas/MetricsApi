import * as joi from 'joi';
import { addressSchema } from './address.dto';
import { AuthRole } from '../auth/role.enum';
const userValidator = joi.object().keys({
    firstName: joi.string().required(),
    lastName: joi.string().required(),
    email: joi.string().required(),
    password: joi.string().required(),
    role: joi.string().required(),
    phone: joi.string().required(),
    company: joi.string().required(),
    address: addressSchema.allow(null),
});
const userCreateValidator = joi.object().keys({
    firstName: joi.string().required(),
    lastName: joi.string().required(),
    email: joi.string().required(),
    password: joi.string().required(),
    confirm: joi.any().valid(joi.ref('password')).required(),
    role: joi.string().default(AuthRole.ADMIN),
    phone: joi.string().required(),
    company: joi.string().allow(null),
    address: addressSchema.allow(null),
});
const userUpdateValidator = joi.object().keys({
    firstName: joi.string(),
    lastName: joi.string(),
    email: joi.string(),
    role: joi.string().default(AuthRole.ADMIN),
    phone: joi.string().required(),
    company: joi.string(),
    address: addressSchema.allow(null),
    isActive: joi.boolean(),
    isLocked: joi.boolean(),
    isDeleted: joi.boolean(),
});
const paginationValidator = joi.object().keys({
    page: joi.number(),
    limit: joi.number(),
    search: joi.string(),
});
export { userValidator, userCreateValidator, userUpdateValidator, paginationValidator };
//# sourceMappingURL=user.dto.js.map