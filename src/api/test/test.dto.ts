import * as joi from 'joi';

const testCreateValidator: any = joi.object().keys({
  name: joi.string().required(),
  metricId: joi.string().required(),
  strain: joi.string().required(),
  type: joi.number().allow(null),
  plantedOn: joi.date().allow(null),
  mother: joi.string().allow(null),
  currentPhase: joi.string().required(),
  location: joi.string().required(),
});

const testUpdateValidator: any = joi.object().keys({
  name: joi.string(),
  metricId: joi.string(),
  strain: joi.string(),
  type: joi.number().allow(null),
  plantedOn: joi.date().allow(null),
  mother: joi.string().allow(null),
  location: joi.string(),
});

export { testCreateValidator, testUpdateValidator };
