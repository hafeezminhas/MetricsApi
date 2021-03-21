import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import UserWithThatEmailAlreadyExistsException from '../../exceptions/UserWithThatEmailAlreadyExistsException';
import { userModel } from './../user/user.model';
class AuthenticationService {
    constructor() {
        this.user = userModel;
    }
    async register(userData) {
        if (await this.user.findOne({ email: userData.email })) {
            throw new UserWithThatEmailAlreadyExistsException(userData.email);
        }
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        return await this.user.create(Object.assign(Object.assign({}, userData), { password: hashedPassword }));
    }
    async changePassword(user, newPass) {
        const hashedPassword = await bcrypt.hash(newPass, 10);
        const updated = await this.user.findByIdAndUpdate(user._id, {
            $set: { password: hashedPassword },
            new: true,
        });
        const token = this.createToken(updated);
        return { token, user: updated };
    }
    createToken(user) {
        const expiresIn = +process.env.JWT_AGE;
        const secret = process.env.JWT_SECRET;
        const tokenData = {
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
export { AuthenticationService };
//# sourceMappingURL=auth.service.js.map