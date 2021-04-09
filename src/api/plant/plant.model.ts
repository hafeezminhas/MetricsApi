import * as mongoose from 'mongoose';
import { Plant } from './plant.interface';

const plantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    metricId: { type: String, required: true },
    strain: { type: String, required: false },
    type: { type: Number, required: true },
    plantedOn: { type: Date, required: true },
    mother: { type: String },
    currentPhase: { type: String, required: true },
    phaseHistory: [{ ref: 'PhaseHistory', type: mongoose.Schema.Types.ObjectId }],
    location: { type: String, required: true },
    company: { ref: 'Company', type: mongoose.Schema.Types.ObjectId },
    isDeleted: {
      type: Boolean,
      default: false,
      get: (): undefined => undefined,
    },
  },
  { timestamps: true },
);

const plantModel = mongoose.model<Plant & mongoose.Document>('Plant', plantSchema);

export { plantModel };
