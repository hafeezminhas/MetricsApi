import * as mongoose from 'mongoose';
import { PlantPhaseHistory } from './plant-phase-history.dto';

const phasehistorySchema = new mongoose.Schema(
  {
    phase: { type: String, required: true },
    start: { type: Date, required: true },
    end: { type: Date, required: true },
  },
);

const phaseHistoryModel = mongoose.model<PlantPhaseHistory & mongoose.Document>('PhaseHistory', phasehistorySchema);

export { phaseHistoryModel };
