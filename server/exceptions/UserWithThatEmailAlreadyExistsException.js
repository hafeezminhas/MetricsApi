import HttpException from './HttpException';
class UserWithThatEmailAlreadyExistsException extends HttpException {
    constructor(email) {
        super(400, `User with email ${email} already exists`);
    }
}
export default UserWithThatEmailAlreadyExistsException;
//# sourceMappingURL=UserWithThatEmailAlreadyExistsException.js.map