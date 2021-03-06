import * as bcrypt from 'bcrypt';
import { NextFunction, Request, Response, Router } from 'express';
import * as jwt from 'jsonwebtoken';
import { createValidator } from 'express-joi-validation';
import WrongCredentialsException from '../../exceptions/WrongCredentialsException';
import Controller from '../../interfaces/controller.interface';
import TokenData from '../../interfaces/tokenData.interface';
import { User, userValidator } from '../user/user.dto';
import { userModel } from './../user/user.model';
import { AuthenticationService } from './auth.service';
import { credentialsValidator, passwordValidator } from './auth.dto';
import TokenPayload from '../../interfaces/dataStoredInToken';
import authMiddleware from '../../middleware/auth.middleware';

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
    this.router.post(`${this.path}/register`, validator.body(userValidator), this.registration);
    this.router.post(`${this.path}/password`, authMiddleware, validator.body(passwordValidator), this.changePassword);
    this.router.post(`${this.path}/login`, validator.body(credentialsValidator), this.login);
    this.router.post(`${this.path}/logout`, this.logout);
  }

  private registration = async (request: Request, response: Response, next: NextFunction) => {
    const userData: User = request.body;
    try {
      const user = await this.authenticationService.register(userData);
      response.send(user);
    } catch (error) {
      next(error);
    }
  }

  private login = async (request: Request, response: Response, next: NextFunction) => {
    const logInData: { email: string, password: string } = request.body;
    const user = await this.user.findOne({ email: logInData.email });
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

  private changePassword = async (request: Request | any, response: Response, next: NextFunction) => {
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

  // TODO: If server side session is required.
  private logout = (request: Request, response: Response) => {
    response.setHeader('Set-Cookie', ['Authorization=;Max-age=0']);
    response.send(200);
  }

  private createToken(user: User): TokenData {
    const expiresIn = +process.env.JWT_AGE;
    const secret = process.env.JWT_SECRET;
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

}

export { AuthenticationController };
