// @ts-ignore
import * as joi from 'joi';

const testParamsCreateValidator: any = joi.object().keys({
  date:             joi.date().required(),
  airTemp:          joi.number().allow(null),
  airRH:            joi.number().allow(null),
  co2:              joi.number().allow(null),
  lightIntensity:   joi.number().allow(null),
  waterPH:          joi.number().allow(null),
  waterTDS:         joi.number().allow(null),
  waterOxygen:      joi.number().allow(null),
});

const testParamsUpdateValidator: any = joi.object().keys({
  date:             joi.date(),
  airTemp:          joi.number().allow(null),
  airRH:            joi.number().allow(null),
  co2:              joi.number().allow(null),
  lightIntensity:   joi.number().allow(null),
  waterPH:          joi.number().allow(null),
  waterTDS:         joi.number().allow(null),
  waterOxygen:      joi.number().allow(null),
});

const testCreateValidator: any = joi.object().keys({
  name: joi.string().required(),
  description: joi.string().required(),
  plants: joi.array().items(joi.string()),
  testParams: joi.array().items(testParamsCreateValidator),
  resultDate: joi.date().required(),
  wetWeight: joi.number().allow(null),
  dryWeight: joi.number().allow(null),
  trimmedWeight: joi.number().allow(null),
  THCA: joi.number().allow(null),
  DELTATHC: joi.number().allow(null),
  THCVA: joi.number().allow(null),
  CBDA: joi.number().allow(null),
  CBGA: joi.number().allow(null),
  CBL: joi.number().allow(null),
  CBD: joi.number().allow(null),
  CBN: joi.number().allow(null),
  CBT: joi.number().allow(null),
  TAC: joi.number().allow(null),
});

const testUpdateValidator: any = joi.object().keys({
  name: joi.string(),
  description: joi.string(),
  plants: joi.array().items(joi.string()),
  testParams: joi.array().items(testParamsCreateValidator),
  resultDate: joi.date(),
  wetWeight: joi.number().allow(null),
  dryWeight: joi.number().allow(null),
  trimmedWeight: joi.number().allow(null),
  THCA: joi.number().allow(null),
  DELTATHC: joi.number().allow(null),
  THCVA: joi.number().allow(null),
  CBDA: joi.number().allow(null),
  CBGA: joi.number().allow(null),
  CBL: joi.number().allow(null),
  CBD: joi.number().allow(null),
  CBN: joi.number().allow(null),
  CBT: joi.number().allow(null),
  TAC: joi.number().allow(null),
});

export {
  testParamsCreateValidator,
  testParamsUpdateValidator,
  testCreateValidator,
  testUpdateValidator,
};
