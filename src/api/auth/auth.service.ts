import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

import UserWithThatEmailAlreadyExistsException from '../../exceptions/UserWithThatEmailAlreadyExistsException';
import TokenData from '../../interfaces/tokenData.interface';
import TokenPayload from '../../interfaces/dataStoredInToken';
import { User } from '../user/user.dto';
import { userModel } from './../user/user.model';

class AuthenticationService {
  public user = userModel;

  public async register(userData: User) {
    if (
      await this.user.findOne({ email: userData.email })
    ) {
      throw new UserWithThatEmailAlreadyExistsException(userData.email);
    }
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = await this.user.create({ ...userData, password: hashedPassword, });
    return user;
  }

  public async changePassword(user: User, newPass: string) {
    const hashedPassword = await bcrypt.hash(newPass, 10);
    const updated = await this.user.findByIdAndUpdate(user._id, {
      $set: { password: hashedPassword },
      new: true,
    });
    const token = this.createToken(updated);
    return { token, user: updated };
  }

  public createToken(user: User): TokenData {
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

export { AuthenticationService };
