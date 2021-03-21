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
const express_1 = require("express");
const express_joi_validation_1 = require("express-joi-validation");
/* Middlewares */
const auth_middleware_1 = require("../../middleware/auth.middleware");
const permission_middleware_1 = require("../../middleware/permission.middleware");
const company_dto_1 = require("./company.dto");
const role_enum_1 = require("../auth/role.enum");
const company_model_1 = require("./company.model");
const validator = express_joi_validation_1.createValidator();
class CompanyController {
    constructor() {
        this.path = '/companies';
        this.router = express_1.Router();
        this.company = company_model_1.default;
        this.getCompanies = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            const page = +request.query.page || 1;
            const limit = +request.query.limit || 10;
            const search = request.query.search ? request.query.search.toString() : null;
            if (search) {
                const regex = new RegExp(this.escapeRegex(search), 'gi');
                const companies = yield this.company.find({ name: regex })
                    .sort({ update_at: -1 })
                    .skip((page - 1) * limit)
                    .limit(limit);
                const count = yield this.company.countDocuments();
                response.send({ page, limit, count, companies, search });
            }
            else {
                const companies = yield this.company.find()
                    .sort({ update_at: -1 })
                    .skip((page - 1) * limit)
                    .limit(limit);
                const count = yield this.company.countDocuments();
                response.send({ page, limit, count, companies });
            }
        });
        this.createCompany = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            const payload = request.body;
            try {
                const company = yield this.company.create(payload);
                response.send(company);
            }
            catch (e) {
                response.send(e);
            }
        });
        this.getCompanyById = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            const id = request.params.id;
            const companyQuery = this.company.findById(id);
            const company = yield companyQuery;
            if (company) {
                response.send(company);
            }
            else {
                response.send({ message: 'company not found' });
            }
        });
        this.updateCompany = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            const id = request.params.id;
            const companyQuery = this.company.findByIdAndUpdate(id, {
                $set: request.body,
                $new: true,
            });
            try {
                const company = yield companyQuery;
                response.send(company);
            }
            catch (e) {
                response.send(e);
            }
        });
        this.deleteCompany = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            const id = request.params.id;
            try {
                const companyQuery = this.company.findByIdAndDelete(id);
                const company = yield companyQuery;
                response.send(company);
            }
            catch (e) {
                response.send(e);
            }
        });
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get(`${this.path}`, auth_middleware_1.default, permission_middleware_1.default(role_enum_1.AuthRole.XADMIN), this.getCompanies);
        this.router.post(`${this.path}`, auth_middleware_1.default, validator.body(company_dto_1.companyCreateValidator), permission_middleware_1.default(role_enum_1.AuthRole.XADMIN), this.createCompany);
        this.router.get(`${this.path}/:id`, auth_middleware_1.default, permission_middleware_1.default(role_enum_1.AuthRole.XADMIN), this.getCompanyById);
        this.router.put(`${this.path}/:id`, auth_middleware_1.default, validator.body(company_dto_1.companyUpdateValidator), permission_middleware_1.default(role_enum_1.AuthRole.XADMIN), this.updateCompany);
        this.router.delete(`${this.path}/:id`, auth_middleware_1.default, permission_middleware_1.default(role_enum_1.AuthRole.XADMIN), this.deleteCompany);
    }
    escapeRegex(str) {
        return str.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
    }
}
exports.CompanyController = CompanyController;
//# sourceMappingURL=company.controller.js.map