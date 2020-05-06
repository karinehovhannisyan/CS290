import * as mongoose from 'mongoose';
import { PerType } from '../../domain/perType';
import { Configs } from '../../config/config';

export const ProductSchema = new mongoose.Schema({
  name: String,
  category: { type: mongoose.Schema.Types.ObjectId, ref: Configs.providers.category },
  description: String,
  price: Number,
  inStorage: {type: Number, default: 0},
  per: {type: Number, enum: Object.values(PerType)},
  image: String
});
