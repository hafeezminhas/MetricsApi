"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserWithThatEmailAlreadyExistsException_1 = require("../../exceptions/UserWithThatEmailAlreadyExistsException");
const user_model_1 = require("./../user/user.model");
class AuthenticationService {
    constructor() {
        this.user = user_model_1.userModel;
    }
    register(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            if (yield this.user.findOne({ email: userData.email })) {
                throw new UserWithThatEmailAlreadyExistsException_1.default(userData.email);
            }
            const hashedPassword = yield bcrypt.hash(userData.password, 10);
            return yield this.user.create(Object.assign(Object.assign({}, userData), { password: hashedPassword }));
        });
    }
    changePassword(user, newPass) {
        return __awaiter(this, void 0, void 0, function* () {
            const hashedPassword = yield bcrypt.hash(newPass, 10);
            const updated = yield this.user.findByIdAndUpdate(user._id, {
                $set: { password: hashedPassword },
                new: true,
            });
            const token = this.createToken(updated);
            return { token, user: updated };
        });
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
exports.AuthenticationService = AuthenticationService;
//# sourceMappingURL=auth.service.js.map