import * as joi from 'joi';
import { addressSchema } from '../user/address.dto';
import { StateLicenceTypes } from './company.enum';

const companyCreateValidator: any = joi.object().keys({
  name: joi.string().required(),
  email: joi.string().email().required(),
  phone: joi.string().required(),
  website: joi.string().allow(null),
  address: addressSchema,
  established: joi.date().allow(null),
  metricId: joi.string().required(),
  stateLicence: joi.array().items(joi.string()).required(),
  companySize: joi.number().default(1),
  subscriptionType: joi.number().required().valid(...[1, 2]),
  userCount: joi.number().default(5),
});

const companyUpdateValidator: any = joi.object().keys({
  name: joi.string(),
  email: joi.string().email(),
  phone: joi.string(),
  website: joi.string().allow(null),
  address: addressSchema,
  established: joi.date().allow(null),
  metricId: joi.string(),
  stateLicense: joi.array().items(joi.string()),
  companySize: joi.number().default(1),
  subscriptionType: joi.number().valid(...[1, 2]),
  userCount: joi.number().default(5),
});

export  { companyCreateValidator, companyUpdateValidator };
