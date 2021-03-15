import { NextFunction, Request, Response } from 'express';
import NotAuthorizedException from '../exceptions/NotAuthorizedException';

export default function permit(...permittedRoles: string[]) {
  return (request: Request | any, response: Response, next: NextFunction) => {
    if (request.user && permittedRoles.includes(request.user.role)) {
      next();
    } else {
      next(new NotAuthorizedException('Operation forbidden'));
    }
  };
}
