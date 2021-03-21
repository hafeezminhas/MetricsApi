"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const joi = require("joi");
const plant_enum_1 = require("./plant.enum");
const plantPhaseHistoryValidator = joi.object().keys({
    phase: joi.string().required().valid(...plant_enum_1.phaseHistoryList),
    start: joi.date().required(),
    end: joi.date().allow(null),
});
const plantCreateValidator = joi.object().keys({
    name: joi.string().required(),
    metricId: joi.string().required(),
    strain: joi.string().required(),
    type: joi.number().allow(null),
    plantedOn: joi.date().allow(null),
    mother: joi.string().allow(null),
    currentPhase: joi.string().required().valid(...plant_enum_1.phaseHistoryList),
    phaseHistory: joi.array().items(plantPhaseHistoryValidator).required(),
    location: joi.string().required(),
});
exports.plantCreateValidator = plantCreateValidator;
const plantUpdateValidator = joi.object().keys({
    name: joi.string(),
    metricId: joi.string(),
    strain: joi.string(),
    type: joi.number().allow(null),
    plantedOn: joi.date().allow(null),
    mother: joi.string().allow(null),
    currentPhase: joi.string().valid(...plant_enum_1.phaseHistoryList),
    phaseHistory: joi.array().items(plantPhaseHistoryValidator),
    location: joi.string(),
});
exports.plantUpdateValidator = plantUpdateValidator;
//# sourceMappingURL=plant.dto.js.map