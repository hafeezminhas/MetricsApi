import * as bcrypt from 'bcrypt';
import { Router } from 'express';
import * as jwt from 'jsonwebtoken';
import { createValidator } from 'express-joi-validation';
import authMiddleware from '../../middleware/auth.middleware';
import { AuthRole } from './role.enum';
import { credentialsValidator, passwordValidator } from './auth.dto';
import { paginationValidator, userCreateValidator, userUpdateValidator } from '../user/user.dto';
import { userModel } from '../user/user.model';
import permit from '../../middleware/permission.middleware';
import HttpException from '../../exceptions/HttpException';
import WrongCredentialsException from '../../exceptions/WrongCredentialsException';
import { AuthenticationService } from './auth.service';
const validator = createValidator();
class AuthenticationController {
    constructor() {
        this.path = '/auth';
        this.router = Router();
        this.authenticationService = new AuthenticationService();
        this.user = userModel;
        this.registration = async (request, response, next) => {
            const userData = request.body;
            try {
                const user = await this.authenticationService.register(userData);
                response.send(user);
            }
            catch (error) {
                next(error);
            }
        };
        this.login = async (request, response, next) => {
            const logInData = request.body;
            const user = await this.user.findOne({ email: logInData.email });
            if (user) {
                const isMatching = await bcrypt.compare(logInData.password, user.get('password', null, { getters: false }));
                if (isMatching) {
                    const tokenData = this.createToken(user);
                    response.send({ user, token: tokenData.token });
                }
                else {
                    next(new WrongCredentialsException());
                }
            }
            else {
                next(new WrongCredentialsException());
            }
        };
        this.changePassword = async (request, response, next) => {
            const passData = request.body;
            const target = await this.user.findById(request.user._id);
            if (target) {
                const isMatching = await bcrypt.compare(passData.current, target.get('password', null, { getters: false }));
                if (isMatching) {
                    const { token, user } = await this.authenticationService.changePassword(target, passData.password);
                    response.send({ token, user });
                }
                else {
                    next(new WrongCredentialsException());
                }
            }
            else {
                next(new WrongCredentialsException());
            }
        };
        // TODO: If server side session is required.
        this.logout = (request, response) => {
            response.setHeader('Set-Cookie', ['Authorization=;Max-age=0']);
            response.send(200);
        };
        this.getAdminUsers = async (request, response, next) => {
            const page = +request.query.page || 1;
            const limit = +request.query.limit || 10;
            const search = request.query.search || null;
            if (search) {
                const regex = new RegExp(this.escapeRegex(search), 'gi');
                const userQuery = this.user.find({
                    $and: [
                        { role: AuthRole.ADMIN },
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
                    const users = await userQuery;
                    response.send({ page, limit, users, search });
                }
                catch (err) {
                    next(new HttpException(500, err));
                }
            }
            else {
                const userQuery = this.user.find({ role: AuthRole.ADMIN })
                    .skip((page - 1) * limit)
                    .limit(limit)
                    .populate('company');
                try {
                    const users = await userQuery;
                    response.send({ page, limit, users });
                }
                catch (err) {
                    next(new HttpException(500, err));
                }
            }
        };
        this.createAdminUser = async (request, response, next) => {
            const payload = request.body;
            delete payload.confirm;
            try {
                const user = await this.authenticationService.register(payload);
                response.send(user);
            }
            catch (err) {
                next(new HttpException(500, err));
            }
        };
        this.getAdminUser = async (request, response, next) => {
            const id = request.params.id;
            const user = await this.user.findById(id);
            try {
                response.send(user);
            }
            catch (err) {
                next(new HttpException(500, err));
            }
        };
        this.updateAdminUser = async (request, response, next) => {
            const id = request.params.id;
            const payload = request.body;
            try {
                const user = await this.user.update(id, payload, {
                    new: true,
                });
                response.send(user);
            }
            catch (err) {
                next(new HttpException(500, err));
            }
        };
        this.initializeRoutes();
    }
    initializeRoutes() {
        // this.router.post(`${this.path}/register`, validator.body(userValidator), this.registration);
        this.router.post(`${this.path}/password`, authMiddleware, validator.body(passwordValidator), this.changePassword);
        this.router.post(`${this.path}/login`, validator.body(credentialsValidator), this.login);
        this.router.post(`${this.path}/logout`, this.logout);
        this.router.get(`${this.path}/users`, authMiddleware, validator.query(paginationValidator), permit(AuthRole.XADMIN), this.getAdminUsers);
        this.router.post(`${this.path}/users`, authMiddleware, validator.body(userCreateValidator), permit(AuthRole.XADMIN), this.createAdminUser);
        this.router.get(`${this.path}/users/:id`, authMiddleware, permit(AuthRole.XADMIN), this.getAdminUser);
        this.router.put(`${this.path}/users/:id`, authMiddleware, validator.body(userUpdateValidator), permit(AuthRole.XADMIN), this.updateAdminUser);
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
export { AuthenticationController };
//# sourceMappingURL=auth.controller.js.map