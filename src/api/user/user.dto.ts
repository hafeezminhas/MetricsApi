import * as joi from 'joi';

import { Address } from './address.dto';
import { addressSchema } from './address.dto';

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

const adminUserValidator: any = joi.object().keys({
  firstName: joi.string().required(),
  lastName: joi.string().required(),
  email: joi.string().required(),
  password: joi.string().required(),
  confirm: joi.any().valid(joi.ref('password')).required(),
  role: joi.string().required(),
  phone: joi.string().required(),
  company: joi.string().required(),
  address: addressSchema.allow(null),
});

const paginationValidator: any = joi.object().keys({
  page: joi.number(),
  limit: joi.number(),
  search: joi.string(),
});


export { User, userValidator, adminUserValidator, paginationValidator };
