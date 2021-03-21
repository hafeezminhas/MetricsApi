import { Router, Request, Response, NextFunction } from 'express';
import { createValidator } from 'express-joi-validation';
import { ApiPath } from 'swagger-express-typescript';

import { AuthRole } from '../auth/role.enum';
import authMiddleware from '../../middleware/auth.middleware';
import Controller from '../../interfaces/controller.interface';
import permit from '../../middleware/permission.middleware';
import { userModel } from './user.model';
import UserNotFoundException from '../../exceptions/UserNotFoundException';
import {userCreateValidator, userUpdateValidator } from './user.dto';
import HttpException from '../../exceptions/HttpException';
import {AuthenticationService} from '../auth/auth.service';

const validator = createValidator();

@ApiPath({
  path: '/users',
  name: 'User',
  security: { basicAuth: [] },
})
class UserController implements Controller {
  public path = '/users';
  public router = Router();
  private user = userModel;

  public authenticationService = new AuthenticationService();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // @ts-ignore
    this.router.get(`${this.path}`, authMiddleware, permit(AuthRole.ADMIN, AuthRole.XADMIN), this.getUsers);
    // @ts-ignore
    this.router.post(`${this.path}`, authMiddleware, permit(AuthRole.ADMIN), validator.body(userCreateValidator), this.createUser);
    // @ts-ignore
    this.router.get(`${this.path}/:id`, authMiddleware, this.getUserById);
    // @ts-ignore
    this.router.put(`${this.path}/:id`, authMiddleware, validator.body(userUpdateValidator), this.updateUser);
  }

  private getUsers = async (request: Request | any, response: Response, _: NextFunction) => {
    const company = request.user.company;
    const userQuery = this.user.find({ $and: [{ company }, { role: AuthRole.USER }] }).populate('company');
    const users = await userQuery;

    response.send(users);
  }

  private createUser = async (request: Request | any, response: Response, next: NextFunction) => {
    const payload = request.body;
    payload.company = request.user.company;
    payload.role = AuthRole.USER;
    payload.isActive = true;
    payload.isLocked = false;
    console.log(payload);

    try {
      const user = await this.authenticationService.register(payload);
      response.send(user);
    } catch (err) {
      next(new HttpException(500, err));
    }
  }

  private getUserById = async (request: Request | any, response: Response, next: NextFunction) => {
    const id = request.params.id;
    const userQuery = this.user.findById(id);
    const user = await userQuery;
    if (user && user.company === request.user.company) {
      response.send(user);
    } else {
      next(new UserNotFoundException(id));
    }
  }

  private updateUser = async (request: Request, response: Response, next: NextFunction) => {
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
      } catch (err) {
        next(new HttpException(500, err));
      }
    } else {
      next(new UserNotFoundException(id));
    }
  }
}

export { UserController };
