import * as joi from 'joi';
import { phaseHistoryList } from './plant.enum';

const plantCreateValidator: any = joi.object().keys({
  name: joi.string().required(),
  metricId: joi.string().email().required(),
  strain: joi.string().required(),
  type: joi.number().allow(null),
  plantedOn: joi.date().allow(null),
  mother: joi.string().allow(null),
  currentPhase: joi.string().required(),
  phaseHistory: joi.array().empty(),
  location: joi.string().required(),
  company: joi.string().required(),
});

const plantPhaseHistoryValidator: any = joi.object().keys({
  phase: joi.string().required().valid(...phaseHistoryList),
  start: joi.date().required(),
  end: joi.date().allow(null),
});

const plantUpdateValidator: any = joi.object().keys({
  name: joi.string().required(),
  metricId: joi.string().email().required(),
  strain: joi.string().required(),
  type: joi.number().allow(null),
  plantedOn: joi.date().allow(null),
  mother: joi.string().allow(null),
  currentPhase: joi.string().required().valid(...phaseHistoryList),
  phaseHistory: joi.array().items(plantPhaseHistoryValidator),
  location: joi.string().required(),
  company: joi.string().required(),
});

export { plantCreateValidator, plantUpdateValidator };
