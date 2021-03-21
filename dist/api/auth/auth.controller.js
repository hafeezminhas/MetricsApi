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
const bcrypt = require("bcrypt");
const express_1 = require("express");
const jwt = require("jsonwebtoken");
const express_joi_validation_1 = require("express-joi-validation");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const role_enum_1 = require("./role.enum");
const auth_dto_1 = require("./auth.dto");
const user_dto_1 = require("../user/user.dto");
const user_model_1 = require("../user/user.model");
const permission_middleware_1 = require("../../middleware/permission.middleware");
const HttpException_1 = require("../../exceptions/HttpException");
const WrongCredentialsException_1 = require("../../exceptions/WrongCredentialsException");
const auth_service_1 = require("./auth.service");
const validator = express_joi_validation_1.createValidator();
class AuthenticationController {
    constructor() {
        this.path = '/auth';
        this.router = express_1.Router();
        this.authenticationService = new auth_service_1.AuthenticationService();
        this.user = user_model_1.userModel;
        this.registration = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            const userData = request.body;
            try {
                const user = yield this.authenticationService.register(userData);
                response.send(user);
            }
            catch (error) {
                next(error);
            }
        });
        this.login = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            const logInData = request.body;
            const user = yield this.user.findOne({ email: logInData.email });
            if (user) {
                const isMatching = yield bcrypt.compare(logInData.password, user.get('password', null, { getters: false }));
                if (isMatching) {
                    const tokenData = this.createToken(user);
                    response.send({ user, token: tokenData.token });
                }
                else {
                    next(new WrongCredentialsException_1.default());
                }
            }
            else {
                next(new WrongCredentialsException_1.default());
            }
        });
        this.changePassword = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            const passData = request.body;
            const target = yield this.user.findById(request.user._id);
            if (target) {
                const isMatching = yield bcrypt.compare(passData.current, target.get('password', null, { getters: false }));
                if (isMatching) {
                    const { token, user } = yield this.authenticationService.changePassword(target, passData.password);
                    response.send({ token, user });
                }
                else {
                    next(new WrongCredentialsException_1.default());
                }
            }
            else {
                next(new WrongCredentialsException_1.default());
            }
        });
        // TODO: If server side session is required.
        this.logout = (request, response) => {
            response.setHeader('Set-Cookie', ['Authorization=;Max-age=0']);
            response.send(200);
        };
        this.getAdminUsers = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            const page = +request.query.page || 1;
            const limit = +request.query.limit || 10;
            const search = request.query.search || null;
            if (search) {
                const regex = new RegExp(this.escapeRegex(search), 'gi');
                const userQuery = this.user.find({
                    $and: [
                        { role: role_enum_1.AuthRole.ADMIN },
                        {
                            $or: [
                                { name: regex },
                                { email: regex },
                            ],
                        },
                    ],
                })
                    .skip((page - 1) * limit)
                    .limit(limit)
                    .populate('company');
                try {
                    const users = yield userQuery;
                    response.send({ page, limit, users, search });
                }
                catch (err) {
                    next(new HttpException_1.default(500, err));
                }
            }
            else {
                const userQuery = this.user.find({ role: role_enum_1.AuthRole.ADMIN })
                    .skip((page - 1) * limit)
                    .limit(limit)
                    .populate('company');
                try {
                    const users = yield userQuery;
                    response.send({ page, limit, users });
                }
                catch (err) {
                    next(new HttpException_1.default(500, err));
                }
            }
        });
        this.createAdminUser = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            const payload = request.body;
            delete payload.confirm;
            try {
                const user = yield this.authenticationService.register(payload);
                response.send(user);
            }
            catch (err) {
                next(new HttpException_1.default(500, err));
            }
        });
        this.getAdminUser = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            const id = request.params.id;
            const user = yield this.user.findById(id);
            try {
                response.send(user);
            }
            catch (err) {
                next(new HttpException_1.default(500, err));
            }
        });
        this.updateAdminUser = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            const id = request.params.id;
            const payload = request.body;
            try {
                const user = yield this.user.update(id, payload, {
                    new: true,
                });
                response.send(user);
            }
            catch (err) {
                next(new HttpException_1.default(500, err));
            }
        });
        this.initializeRoutes();
    }
    initializeRoutes() {
        // this.router.post(`${this.path}/register`, validator.body(userValidator), this.registration);
        this.router.post(`${this.path}/password`, auth_middleware_1.default, validator.body(auth_dto_1.passwordValidator), this.changePassword);
        this.router.post(`${this.path}/login`, validator.body(auth_dto_1.credentialsValidator), this.login);
        this.router.post(`${this.path}/logout`, this.logout);
        this.router.get(`${this.path}/users`, auth_middleware_1.default, validator.query(user_dto_1.paginationValidator), permission_middleware_1.default(role_enum_1.AuthRole.XADMIN), this.getAdminUsers);
        this.router.post(`${this.path}/users`, auth_middleware_1.default, validator.body(user_dto_1.userCreateValidator), permission_middleware_1.default(role_enum_1.AuthRole.XADMIN), this.createAdminUser);
        this.router.get(`${this.path}/users/:id`, auth_middleware_1.default, permission_middleware_1.default(role_enum_1.AuthRole.XADMIN), this.getAdminUser);
        this.router.put(`${this.path}/users/:id`, auth_middleware_1.default, validator.body(user_dto_1.userUpdateValidator), permission_middleware_1.default(role_enum_1.AuthRole.XADMIN), this.updateAdminUser);
    }
    createToken(user) {
        const expiresIn = +process.env.JWT_AGE;
        const secret = process.env.JWT_SECRET;
        const tokenData = {
            _id: user._id,
            fullName: `${user.firstName} ${user.lastName}`,
            email: user.email,
            phone: user.phone,
            role: user.role,
        };
        return {
            expiresIn,
            token: jwt.sign(tokenData, secret, { expiresIn }),
        };
    }
    escapeRegex(str) {
        return str.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
    }
}
exports.AuthenticationController = AuthenticationController;
//# sourceMappingURL=auth.controller.js.map