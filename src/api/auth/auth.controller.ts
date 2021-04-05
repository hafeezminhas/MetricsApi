import * as bcrypt from 'bcrypt';
import { NextFunction, Request, Response, Router } from 'express';
import * as jwt from 'jsonwebtoken';
import { createValidator } from 'express-joi-validation';

import authMiddleware from '../../middleware/auth.middleware';

import { AuthRole } from './role.enum';

import { credentialsValidator, passwordValidator } from './auth.dto';
import { paginationValidator, User, userCreateValidator, userUpdateValidator } from '../user/user.dto';

import TokenData from '../../interfaces/tokenData.interface';
import TokenPayload from '../../interfaces/dataStoredInToken';
import { userModel } from '../user/user.model';

import permit from '../../middleware/permission.middleware';

import HttpException from '../../exceptions/HttpException';
import WrongCredentialsException from '../../exceptions/WrongCredentialsException';

import { AuthenticationService } from './auth.service';
import Controller from '../../interfaces/controller.interface';
import RequestWithUser from '../../interfaces/requestWithUser.interface';

const validator = createValidator();

class AuthenticationController implements Controller {
  public path = '/auth';
  public router = Router();

  public authenticationService = new AuthenticationService();
  private user = userModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // @ts-ignore
    // this.router.post(`${this.path}/register`, validator.body(userValidator), this.registration);
    // @ts-ignore
    this.router.post(`${this.path}/password`, authMiddleware, validator.body(passwordValidator), this.changePassword);
    // @ts-ignore
    this.router.post(`${this.path}/login`, validator.body(credentialsValidator), this.login);
    // @ts-ignore
    this.router.get(`${this.path}/users`, authMiddleware, validator.query(paginationValidator), permit(AuthRole.XADMIN), this.getAdminUsers);
    // @ts-ignore
    this.router.post(`${this.path}/users`, authMiddleware, validator.body(userCreateValidator), permit(AuthRole.XADMIN), this.createAdminUser);
    // @ts-ignore
    this.router.get(`${this.path}/users/:id`, authMiddleware, permit(AuthRole.XADMIN), this.getAdminUser);
    // @ts-ignore
    this.router.put(`${this.path}/users/:id`, authMiddleware, validator.body(userUpdateValidator), permit(AuthRole.XADMIN), this.updateAdminUser);
  }

  // private registration = async (request: Request, response: Response, next: NextFunction) => {
  //   const userData = request.body;
  //   try {
  //     const user = await this.authenticationService.register(userData);
  //     response.send(user);
  //   } catch (error) {
  //     next(error);
  //   }
  // }

  private login = async (request: Request, response: Response, next: NextFunction) => {
    const logInData: { email: string, password: string } = request.body;
    const user: any = await this.user.findOne({ email: logInData.email });
    if (user) {
      const isMatching = await bcrypt.compare(
        logInData.password,
        user.get('password', null, { getters: false }),
      );
      if (isMatching) {
        const tokenData = this.createToken(user);
        response.send({ user, token: tokenData.token });
      } else {
        next(new WrongCredentialsException());
      }
    } else {
      next(new WrongCredentialsException());
    }
  }

  private changePassword = async (request: RequestWithUser, response: Response, next: NextFunction) => {
    const passData = request.body;
    const target = await this.user.findById(request.user._id);
    if (target) {
      const isMatching = await bcrypt.compare(
        passData.current,
        target.get('password', null, { getters: false }),
      );
      if (isMatching) {
        const { token, user } = await this.authenticationService.changePassword(target, passData.password);
        response.send({ token, user });
      } else {
        next(new WrongCredentialsException());
      }
    } else {
      next(new WrongCredentialsException());
    }
  }

  private createToken(user: User): TokenData {
    const { JWT_AGE, JWT_SECRET } = process.env;
    const expiresIn = JWT_AGE ? +JWT_AGE : 7200;
    const secret = JWT_SECRET as string;
    const tokenData: TokenPayload = {
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

  private getAdminUsers = async (request: RequestWithUser, response: Response, next: NextFunction) => {
    const page = +request.query.page || 1;
    const limit = +request.query.limit || 10;
    const search = request.query.search || null;

    if (search) {
      // @ts-ignore
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
      });

      try {
        const users = await userQuery
                                    .skip((page - 1) * limit)
                                    .limit(limit)
                                    .populate('company');
        const count = await userQuery.countDocuments();

        response.send({ page, limit, users, search, count });
      } catch (err) {
        next(new HttpException(500, err));
      }
    } else {
      try {
        const users = await this.user.find({ role: AuthRole.ADMIN })
                                    .skip((page - 1) * limit)
                                    .limit(limit)
                                    .populate('company');
        const count = await this.user.find({ role: AuthRole.ADMIN }).countDocuments();

        response.send({ page, limit, users, count });
      } catch (err) {
        next(new HttpException(500, err));
      }
    }
  }

  private createAdminUser = async (request: RequestWithUser, response: Response, next: NextFunction) => {
    const payload = request.body;
    delete payload.confirm;

    try {
      const user = await this.authenticationService.register(payload);
      response.send(user);
    } catch (err) {
      next(new HttpException(500, err));
    }
  }

  private getAdminUser = async (request: RequestWithUser, response: Response, next: NextFunction) => {
    const id = request.params.id;
    const user = await this.user.findById(id);

    try {
      response.send(user);
    } catch (err) {
      next(new HttpException(500, err));
    }
  }

  private updateAdminUser = async (request: RequestWithUser, response: Response, next: NextFunction) => {
    const id = request.params.id;
    const payload = request.body;
    try {
      const user = await this.user.findByIdAndUpdate(
        id,
        { ...payload },
        { new: true },
      );

      response.send(user);
    } catch (err) {
      next(new HttpException(500, err));
    }
  }

  private escapeRegex (str: string): any {
    return str.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
  }
}

export { AuthenticationController };
