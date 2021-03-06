import * as mongoose from 'mongoose';
import User from './user.interface';
import { AuthRole } from '../auth/role.enum';

const addressSchema = new mongoose.Schema({
  city: String,
  country: String,
  zip: Number,
  street: String,
});

const userSchema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    email: { type: String, unique: true },
    phone: {type: String, required: true },
    address: addressSchema,
    password: {
      type: String,
      get: (): undefined => undefined,
    },
    role: { type: String, default: AuthRole.USER },
    company: { ref: 'Company', type: mongoose.Schema.Types.ObjectId },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      getters: true,
    },
  },
);

userSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

const userModel = mongoose.model<User & mongoose.Document>('User', userSchema);

export { userModel };
