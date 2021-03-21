import * as jwt from 'jsonwebtoken';
import AuthenticationTokenMissingException from '../exceptions/AuthenticationTokenMissingException';
import WrongAuthenticationTokenException from '../exceptions/WrongAuthenticationTokenException';
import { userModel } from '../api/user/user.model';
async function authMiddleware(request, response, next) {
    if (request.headers && request.headers.authorization) {
        const secret = process.env.JWT_SECRET;
        try {
            const token = request.headers.authorization;
            const verificationResponse = jwt.verify(token, secret);
            const id = verificationResponse._id;
            const user = await userModel.findById(id);
            if (user) {
                request.user = user;
                next();
            }
            else {
                next(new WrongAuthenticationTokenException());
            }
        }
        catch (error) {
            next(new WrongAuthenticationTokenException());
        }
    }
    else {
        next(new AuthenticationTokenMissingException());
    }
}
export default authMiddleware;
//# sourceMappingURL=auth.middleware.js.map