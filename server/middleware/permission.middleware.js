import NotAuthorizedException from '../exceptions/NotAuthorizedException';
export default function permit(...permittedRoles) {
    return (request, response, next) => {
        if (request.user && permittedRoles.includes(request.user.role)) {
            next();
        }
        else {
            next(new NotAuthorizedException('Operation forbidden'));
        }
    };
}
//# sourceMappingURL=permission.middleware.js.map