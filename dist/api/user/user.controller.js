"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
const swagger_express_typescript_1 = require("swagger-express-typescript");
const role_enum_1 = require("../auth/role.enum");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const permission_middleware_1 = require("../../middleware/permission.middleware");
const user_model_1 = require("./user.model");
const UserNotFoundException_1 = require("../../exceptions/UserNotFoundException");
const user_dto_1 = require("./user.dto");
const HttpException_1 = require("../../exceptions/HttpException");
const auth_service_1 = require("../auth/auth.service");
const validator = express_joi_validation_1.createValidator();
let UserController = class UserController {
    constructor() {
        this.path = '/users';
        this.router = express_1.Router();
        this.user = user_model_1.userModel;
        this.authenticationService = new auth_service_1.AuthenticationService();
        this.getUsers = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            const company = request.user.company;
            const userQuery = this.user.find({ $and: [{ company }, { role: role_enum_1.AuthRole.USER }] }).populate('company');
            const users = yield userQuery;
            response.send(users);
        });
        this.createUser = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            const payload = request.body;
            payload.company = request.user.company;
            payload.role = role_enum_1.AuthRole.USER;
            payload.isActive = true;
            payload.isLocked = false;
            console.log(payload);
            try {
                const user = yield this.authenticationService.register(payload);
                response.send(user);
            }
            catch (err) {
                next(new HttpException_1.default(500, err));
            }
        });
        this.getUserById = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            const id = request.params.id;
            const userQuery = this.user.findById(id);
            const user = yield userQuery;
            if (user && user.company === request.user.company) {
                response.send(user);
            }
            else {
                next(new UserNotFoundException_1.default(id));
            }
        });
        this.updateUser = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            const id = request.params.id;
            const payload = request.body;
            const target = yield this.user.findById(id);
            if (target) {
                try {
                    const user = yield this.user.findByIdAndUpdate(id, {
                        $set: payload,
                        $new: true,
                    });
                    response.send(user);
                }
                catch (err) {
                    next(new HttpException_1.default(500, err));
                }
            }
            else {
                next(new UserNotFoundException_1.default(id));
            }
        });
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get(`${this.path}`, auth_middleware_1.default, permission_middleware_1.default(role_enum_1.AuthRole.ADMIN, role_enum_1.AuthRole.XADMIN), this.getUsers);
        this.router.post(`${this.path}`, auth_middleware_1.default, permission_middleware_1.default(role_enum_1.AuthRole.ADMIN), validator.body(user_dto_1.userCreateValidator), this.createUser);
        this.router.get(`${this.path}/:id`, auth_middleware_1.default, this.getUserById);
        this.router.put(`${this.path}/:id`, auth_middleware_1.default, validator.body(user_dto_1.userUpdateValidator), this.updateUser);
    }
};
UserController = __decorate([
    swagger_express_typescript_1.ApiPath({
        path: '/users',
        name: 'User',
        security: { basicAuth: [] },
    })
], UserController);
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map