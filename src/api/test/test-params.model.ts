import * as mongoose from 'mongoose';
import { TestParams } from './test.interface';

const testParamsSchema = new mongoose.Schema(
  {
    data:       { type: Date, required: true },
    airTemp:    { type: Number, required: true },
    airRH:      { type: Number, required: true },
    co2:        { type: Number, required: true },
    lightInt:   { type: Number, required: true },
    waterPH:    { type: Number, required: true },
    waterTDS:   { type: Number, required: true },
    waterOxygen:{ type: Number, required: true },
  },
  { timestamps: true },
);

const testParamsModel = mongoose.model<TestParams & mongoose.Document>('TestParam', testParamsSchema);

export { testParamsModel };
