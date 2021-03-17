import * as joi from 'joi';
import { phaseHistoryList } from './plant.enum';

const plantPhaseHistoryValidator: any = joi.object().keys({
  phase: joi.string().required().valid(...phaseHistoryList),
  start: joi.date().required(),
  end: joi.date().allow(null),
});

const plantCreateValidator: any = joi.object().keys({
  name: joi.string().required(),
  metricId: joi.string().required(),
  strain: joi.string().required(),
  type: joi.number().allow(null),
  plantedOn: joi.date().allow(null),
  mother: joi.string().allow(null),
  currentPhase: joi.string().required().valid(...phaseHistoryList),
  phaseHistory: joi.array().items(plantPhaseHistoryValidator).required(),
  location: joi.string().required(),
});

const plantUpdateValidator: any = joi.object().keys({
  name: joi.string(),
  metricId: joi.string(),
  strain: joi.string(),
  type: joi.number().allow(null),
  plantedOn: joi.date().allow(null),
  mother: joi.string().allow(null),
  currentPhase: joi.string().valid(...phaseHistoryList),
  phaseHistory: joi.array().items(plantPhaseHistoryValidator),
  location: joi.string(),
});

export { plantCreateValidator, plantUpdateValidator };
