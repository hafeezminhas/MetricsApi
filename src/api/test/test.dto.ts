// @ts-ignore
import * as joi from 'joi';

const testParamsCreateValidator: any = joi.object().keys({
  date:        joi.date().required(),
  airTemp:     joi.number().required(),
  airRH:       joi.number().required(),
  co2:         joi.number().required(),
  lightIntensity:    joi.number().required(),
  waterPH:     joi.number().required(),
  waterTDS:    joi.number().required(),
  waterOxygen: joi.number().required(),
});

const testParamsUpdateValidator: any = joi.object().keys({
  date:        joi.date(),
  airTemp:     joi.number(),
  airRH:       joi.number(),
  co2:         joi.number(),
  lightIntensity:    joi.number(),
  waterPH:     joi.number(),
  waterTDS:    joi.number(),
  waterOxygen: joi.number(),
});

const testCreateValidator: any = joi.object().keys({
  name: joi.string().required(),
  description: joi.string().required(),
  plants: joi.array().items(joi.string()),
  testParams: joi.array().items(testParamsCreateValidator),
  resultDate: joi.date().required(),
  wetWeight: joi.number().required(),
  dryWeight: joi.number().required(),
  trimmedWeight: joi.number().required(),
  THCA: joi.number().required(),
  DELTATHC: joi.number().required(),
  THCVA: joi.number().required(),
  CBDA: joi.number().required(),
  CBGA: joi.number().required(),
  CBL: joi.number().required(),
  CBD: joi.number().required(),
  CBN: joi.number().required(),
  CBT: joi.number().required(),
  TAC: joi.number().required(),
});

const testUpdateValidator: any = joi.object().keys({
  name: joi.string(),
  description: joi.string(),
  plants: joi.array().items(joi.string()),
  testParams: joi.array().items(testParamsCreateValidator),
  resultDate: joi.date(),
  wetWeight: joi.number(),
  dryWeight: joi.number(),
  trimmedWeight: joi.number(),
  THCA: joi.number(),
  DELTATHC: joi.number(),
  THCVA: joi.number(),
  CBDA: joi.number(),
  CBGA: joi.number(),
  CBL: joi.number(),
  CBD: joi.number(),
  CBN: joi.number(),
  CBT: joi.number(),
  TAC: joi.number(),
});

export {
  testParamsCreateValidator,
  testParamsUpdateValidator,
  testCreateValidator,
  testUpdateValidator,
};
