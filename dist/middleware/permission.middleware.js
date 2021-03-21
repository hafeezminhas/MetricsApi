"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const NotAuthorizedException_1 = require("../exceptions/NotAuthorizedException");
function permit(...permittedRoles) {
    return (request, response, next) => {
        if (request.user && permittedRoles.includes(request.user.role)) {
            next();
        }
        else {
            next(new NotAuthorizedException_1.default('Operation forbidden'));
        }
    };
}
exports.default = permit;
//# sourceMappingURL=permission.middleware.js.map