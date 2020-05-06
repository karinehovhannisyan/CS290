import * as mongoose from 'mongoose';
import { Configs } from '../../config/config';

const OrderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: Configs.providers.product },
  quantity: Number
});
export const OrderSchema = new mongoose.Schema({
  date: Date,
  user: { type: mongoose.Schema.Types.ObjectId, ref: Configs.providers.user },
  address: String,
  orderItems: [OrderItemSchema]
});
