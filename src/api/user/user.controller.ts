import { Router, Request, Response, NextFunction } from 'express';
import { createValidator } from 'express-joi-validation';
import { ApiOperationGet, ApiPath, SwaggerDefinitionConstant } from 'swagger-express-typescript';

import Controller from '../../interfaces/controller.interface';
import authMiddleware from '../../middleware/auth.middleware';
import { userModel } from './user.model';
import UserNotFoundException from '../../exceptions/UserNotFoundException';
import { userValidator } from './user.dto';

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

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, authMiddleware, this.getUsers);
    this.router.post(`${this.path}`, authMiddleware, validator.body(userValidator), this.getUsers);
    this.router.get(`${this.path}/:id`, authMiddleware, this.getUserById);
  }

  private getUsers = async (request: Request, response: Response, next: NextFunction) => {
    const id = request.params.id;
    const page = +request.query.page || 1;
    const limit = +request.query.limit || 10;
    const userQuery = this.user.find()
                               .skip(page * limit)
                               .limit(limit)
                               .populate('company');

    const user = await userQuery;
    if (user) {
      response.send(user);
    } else {
      next(new UserNotFoundException(id));
    }
  }

  private createUser = async (request: Request, response: Response, next: NextFunction) => {
    const id = request.params.id;
    const page = +request.query.page || 1;
    const limit = +request.query.limit || 10;
    const userQuery = this.user.find()
                               .skip(page * limit)
                               .limit(limit)
                               .populate('company');

    const user = await userQuery;
    if (user) {
      response.send(user);
    } else {
      next(new UserNotFoundException(id));
    }
  }

  private getUserById = async (request: Request, response: Response, next: NextFunction) => {
    const id = request.params.id;
    const userQuery = this.user.findById(id);
    if (request.query.withPosts === 'true') {
      userQuery.populate('posts').exec();
    }
    const user = await userQuery;
    if (user) {
      response.send(user);
    } else {
      next(new UserNotFoundException(id));
    }
  }
}

export { UserController };
