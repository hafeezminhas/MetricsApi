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
    wetWeight:      { type: Number, required: true },
    dryWeight:      { type: Number, required: true },
    trimmedWeight:  { type: Number, required: true },
    THCA:           { type: Number, required: true },
    DELTATHC:       { type: Number, required: true },
    THCVA:          { type: Number, required: true },
    CBDA:           { type: Number, required: true },
    CBGA:           { type: Number, required: true },
    CBL:            { type: Number, required: true },
    CBD:            { type: Number, required: true },
    CBN:            { type: Number, required: true },
    CBT:            { type: Number, required: true },
    TAC:            { type: Number, required: true },
    isDeleted:      { type: Boolean, default: false },
  },
  { timestamps: true },
);

const testModel = mongoose.model<Test & mongoose.Document>('Test', testSchema);

export { testModel };
