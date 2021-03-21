import * as joi from 'joi';

import { Address } from './address.dto';
import { addressSchema } from './address.dto';
import {AuthRole} from '../auth/role.enum';

interface User {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  role: string;
  company: string;
  address: Address;
  isActive: boolean;
  isLocked: boolean;
  isDeleted: boolean;
}

const userValidator: any = joi.object().keys({
  firstName: joi.string().required(),
  lastName: joi.string().required(),
  email: joi.string().required(),
  password: joi.string().required(),
  role: joi.string().required(),
  phone: joi.string().required(),
  company: joi.string().required(),
  address: addressSchema.allow(null),
});

const userCreateValidator: any = joi.object().keys({
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

const userUpdateValidator: any = joi.object().keys({
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

const paginationValidator: any = joi.object().keys({
  page: joi.number(),
  limit: joi.number(),
  search: joi.string(),
});


export { User, userValidator, userCreateValidator, userUpdateValidator, paginationValidator };
