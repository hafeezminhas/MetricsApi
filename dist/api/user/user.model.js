"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const role_enum_1 = require("../auth/role.enum");
const addressSchema = new mongoose.Schema({
    street: String,
    city: String,
    zip: Number,
    state: String,
});
const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: { type: String, unique: true },
    phone: { type: String, required: true },
    address: addressSchema,
    password: {
        type: String,
        get: () => undefined,
    },
    role: { type: String, default: role_enum_1.AuthRole.USER },
    company: { ref: 'Company', type: mongoose.Schema.Types.ObjectId },
}, {
    timestamps: true,
    toJSON: { virtuals: true, getters: true },
});
userSchema.virtual('fullName').get(function () {
    return `${this.firstName} ${this.lastName}`;
});
const userModel = mongoose.model('User', userSchema);
exports.userModel = userModel;
//# sourceMappingURL=user.model.js.map