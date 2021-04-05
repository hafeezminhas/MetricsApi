import * as mongoose from 'mongoose';
import { AuthRole } from '../auth/role.enum';
import { User } from './user.interface';

const addressSchema = new mongoose.Schema({
  street: String,
  city: String,
  zip: Number,
  state: String,
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
    isActive: { type: Boolean },
    isLocked: { type: Boolean },
    isDeleted: {
      type: Boolean,
      default: false,
      get: (): undefined => undefined,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true, getters: true },
  },
);

userSchema.virtual('fullName').get(function () {
  // @ts-ignore
  return `${this.firstName} ${this.lastName}`;
});

const userModel = mongoose.model<User & mongoose.Document>('User', userSchema);

export { userModel };
