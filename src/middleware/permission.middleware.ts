import { NextFunction, Request, Response } from 'express';
import NotAuthorizedException from '../exceptions/NotAuthorizedException';

export default function permit(...permittedRoles: string[]) {
  return (request: Request | any, response: Response, next: NextFunction) => {
    console.log(permittedRoles, request.user.role);
    console.log(permittedRoles.includes(request.user.role));
    if (request.user && permittedRoles.includes(request.user.role)) {
      next();
    } else {
      next(new NotAuthorizedException('Operation forbidden'));
    }
  };
}
