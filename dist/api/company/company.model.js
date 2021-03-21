"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const addressSchema = new mongoose.Schema({
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: Number,
});
const companySchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: false },
    website: { type: String, required: false },
    address: addressSchema,
    established: Date,
    metricId: { type: String, required: true },
    stateLicense: [{ type: String, required: true }],
    companySize: { type: Number, default: 1 },
    subscriptionType: { type: Number, default: 1 },
    userCount: { type: Number, default: 5 },
}, {
    timestamps: true,
    toJSON: { virtuals: true, getters: true },
});
const companyModel = mongoose.model('Company', companySchema);
exports.default = companyModel;
//# sourceMappingURL=company.model.js.map