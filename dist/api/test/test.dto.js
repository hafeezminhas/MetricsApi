"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const joi = require("joi");
const testCreateValidator = joi.object().keys({
    name: joi.string().required(),
    metricId: joi.string().required(),
    strain: joi.string().required(),
    type: joi.number().allow(null),
    plantedOn: joi.date().allow(null),
    mother: joi.string().allow(null),
    currentPhase: joi.string().required(),
    location: joi.string().required(),
});
exports.testCreateValidator = testCreateValidator;
const testUpdateValidator = joi.object().keys({
    name: joi.string(),
    metricId: joi.string(),
    strain: joi.string(),
    type: joi.number().allow(null),
    plantedOn: joi.date().allow(null),
    mother: joi.string().allow(null),
    location: joi.string(),
});
exports.testUpdateValidator = testUpdateValidator;
//# sourceMappingURL=test.dto.js.map