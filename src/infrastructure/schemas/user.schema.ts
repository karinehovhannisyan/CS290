import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  name: String,
  surname: String,
  password: String,
  token: String,
  email: String,
  dob: Date,
  phone: String,
  balance: { type: Number, default: 0 },
  updatedAt: Date,
  role: Number
});
