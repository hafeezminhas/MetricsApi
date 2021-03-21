"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const phasehistorySchema = new mongoose.Schema({
    phase: { type: String, required: true },
    start: { type: Date, required: true },
    end: { type: Date, required: true },
});
const phaseHistoryModel = mongoose.model('PhaseHistory', phasehistorySchema);
exports.phaseHistoryModel = phaseHistoryModel;
//# sourceMappingURL=phase-history.model.js.map