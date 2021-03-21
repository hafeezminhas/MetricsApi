"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_joi_validation_1 = require("express-joi-validation");
const express_1 = require("express");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const phase_history_model_1 = require("./phase-history.model");
const plant_model_1 = require("./plant.model");
const plant_dto_1 = require("./plant.dto");
const validator = express_joi_validation_1.createValidator();
class PlantController {
    constructor() {
        this.path = '/plants';
        this.router = express_1.Router();
        this.phaseHistory = phase_history_model_1.phaseHistoryModel;
        this.plant = plant_model_1.plantModel;
        this.getPlants = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            const page = +request.query.page || 1;
            const limit = +request.query.limit || 10;
            const search = request.query.search ? request.query.search.toString() : null;
            if (search) {
                const regex = new RegExp(this.escapeRegex(search), 'gi');
                const plants = yield this.plant.find({ $or: [{ name: regex }, { metricId: regex }] })
                    .sort({ update_at: -1 })
                    .skip((page - 1) * limit)
                    .limit(limit)
                    .populate('phaseHistory');
                const count = yield this.plant.countDocuments();
                response.send({ page, limit, plants, count });
            }
            else {
                const plants = yield this.plant.find()
                    .sort({ update_at: -1 })
                    .skip((page - 1) * limit)
                    .limit(limit)
                    .populate('phaseHistory');
                const count = yield this.plant.countDocuments();
                response.send({ page, limit, plants, count });
            }
        });
        this.createPlant = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            const payload = request.body;
            payload.company = request.user.company;
            try {
                const phases = yield this.phaseHistory.insertMany(payload.phaseHistory);
                payload.phaseHistory = phases.map(p => p._id);
                const plant = yield this.plant.create(payload);
                response.send(plant);
            }
            catch (e) {
                response.send(e);
            }
        });
        this.getPlantById = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            const id = request.params.id;
            const plantQuery = this.plant.findById(id).populate('phaseHistory');
            const plant = yield plantQuery;
            if (plant) {
                response.send(plant);
            }
            else {
                response.send({ message: 'plant not found' });
            }
        });
        this.updatePlant = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            const id = request.params.id;
            const payload = request.body;
            let newPhases;
            try {
                if (payload.phaseHistory.length) {
                    newPhases = yield this.phaseHistory.insertMany(payload.phaseHistory);
                    const pushPhases = () => __awaiter(this, void 0, void 0, function* () {
                        for (const ph of newPhases) {
                            yield this.plant.findByIdAndUpdate(id, {
                                $push: { phaseHistory: ph._id },
                            });
                        }
                    });
                    yield pushPhases();
                }
                delete payload.phaseHistory;
                const updateQuery = this.plant.findByIdAndUpdate(id, {
                    $set: payload,
                });
                const plant = yield updateQuery;
                response.send(plant);
            }
            catch (e) {
                response.send(e);
            }
        });
        this.deletePlant = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            const id = request.params.id;
            try {
                const plantQuery = this.plant.findByIdAndDelete(id);
                const plant = yield plantQuery;
                response.send(plant);
            }
            catch (e) {
                response.send(e);
            }
        });
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get(`${this.path}`, auth_middleware_1.default, this.getPlants);
        this.router.post(`${this.path}`, auth_middleware_1.default, validator.body(plant_dto_1.plantCreateValidator), this.createPlant);
        this.router.get(`${this.path}/:id`, auth_middleware_1.default, this.getPlantById);
        this.router.put(`${this.path}/:id`, auth_middleware_1.default, validator.body(plant_dto_1.plantUpdateValidator), this.updatePlant);
        this.router.delete(`${this.path}/:id`, auth_middleware_1.default, this.deletePlant);
    }
    escapeRegex(str) {
        return str.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
    }
}
exports.PlantController = PlantController;
//# sourceMappingURL=plant.controller.js.map