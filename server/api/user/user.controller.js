var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Router } from 'express';
import { createValidator } from 'express-joi-validation';
import { ApiPath } from 'swagger-express-typescript';
import { AuthRole } from '../auth/role.enum';
import authMiddleware from '../../middleware/auth.middleware';
import permit from '../../middleware/permission.middleware';
import { userModel } from './user.model';
import UserNotFoundException from '../../exceptions/UserNotFoundException';
import { userCreateValidator, userUpdateValidator } from './user.dto';
import HttpException from '../../exceptions/HttpException';
import { AuthenticationService } from '../auth/auth.service';
const validator = createValidator();
let UserController = class UserController {
    constructor() {
        this.path = '/users';
        this.router = Router();
        this.user = userModel;
        this.authenticationService = new AuthenticationService();
        this.getUsers = async (request, response, next) => {
            const company = request.user.company;
            const userQuery = this.user.find({ $and: [{ company }, { role: AuthRole.USER }] }).populate('company');
            const users = await userQuery;
            response.send(users);
        };
        this.createUser = async (request, response, next) => {
            const payload = request.body;
            payload.company = request.user.company;
            payload.role = AuthRole.USER;
            payload.isActive = true;
            payload.isLocked = false;
            console.log(payload);
            try {
                const user = await this.authenticationService.register(payload);
                response.send(user);
            }
            catch (err) {
                next(new HttpException(500, err));
            }
        };
        this.getUserById = async (request, response, next) => {
            const id = request.params.id;
            const userQuery = this.user.findById(id);
            const user = await userQuery;
            if (user && user.company === request.user.company) {
                response.send(user);
            }
            else {
                next(new UserNotFoundException(id));
            }
        };
        this.updateUser = async (request, response, next) => {
            const id = request.params.id;
            const payload = request.body;
            const target = await this.user.findById(id);
            if (target) {
                try {
                    const user = await this.user.findByIdAndUpdate(id, {
                        $set: payload,
                        $new: true,
                    });
                    response.send(user);
                }
                catch (err) {
                    next(new HttpException(500, err));
                }
            }
            else {
                next(new UserNotFoundException(id));
            }
        };
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get(`${this.path}`, authMiddleware, permit(AuthRole.ADMIN, AuthRole.XADMIN), this.getUsers);
        this.router.post(`${this.path}`, authMiddleware, permit(AuthRole.ADMIN), validator.body(userCreateValidator), this.createUser);
        this.router.get(`${this.path}/:id`, authMiddleware, this.getUserById);
        this.router.put(`${this.path}/:id`, authMiddleware, validator.body(userUpdateValidator), this.updateUser);
    }
};
UserController = __decorate([
    ApiPath({
        path: '/users',
        name: 'User',
        security: { basicAuth: [] },
    }),
    __metadata("design:paramtypes", [])
], UserController);
export { UserController };
//# sourceMappingURL=user.controller.js.map