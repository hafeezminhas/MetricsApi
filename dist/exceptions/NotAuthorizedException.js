"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HttpException_1 = require("./HttpException");
class NotAuthorizedException extends HttpException_1.default {
    constructor(message) {
        super(403, message || 'You are not authorized');
    }
}
exports.default = NotAuthorizedException;
//# sourceMappingURL=NotAuthorizedException.js.map