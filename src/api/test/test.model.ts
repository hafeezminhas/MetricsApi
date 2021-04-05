import * as mongoose from 'mongoose';
import { Test } from './test.interface';

const testSchema = new mongoose.Schema(
  {
    name:           { type: String, required: true },
    description:    { type: String, required: true },
    plants:         [{ ref: 'Plant', type: mongoose.Schema.Types.ObjectId }],
    testParams:     [{ ref: 'TestParam', type: mongoose.Schema.Types.ObjectId }],
    company:        { ref: 'Company', type: mongoose.Schema.Types.ObjectId, required: true },
    resultDate:     { type: Date, required: true },
    wetWeight:      { type: Number },
    dryWeight:      { type: Number },
    trimmedWeight:  { type: Number },
    THCA:           { type: Number },
    DELTATHC:       { type: Number },
    THCVA:          { type: Number },
    CBDA:           { type: Number },
    CBGA:           { type: Number },
    CBL:            { type: Number },
    CBD:            { type: Number },
    CBN:            { type: Number },
    CBT:            { type: Number },
    TAC:            { type: Number },
    isDeleted:      { type: Boolean, default: false, get: (): undefined => undefined },
  },
  { timestamps: true },
);

const testModel = mongoose.model<Test & mongoose.Document>('Test', testSchema);

export { testModel };
