import * as mongoose from 'mongoose';
const phasehistorySchema = new mongoose.Schema({
    phase: { type: String, required: true },
    start: { type: Date, required: true },
    end: { type: Date, required: true },
});
const phaseHistoryModel = mongoose.model('PhaseHistory', phasehistorySchema);
export { phaseHistoryModel };
//# sourceMappingURL=phase-history.model.js.map