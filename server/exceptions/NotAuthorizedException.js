import HttpException from './HttpException';
class NotAuthorizedException extends HttpException {
    constructor(message) {
        super(403, message || 'You are not authorized');
    }
}
export default NotAuthorizedException;
//# sourceMappingURL=NotAuthorizedException.js.map