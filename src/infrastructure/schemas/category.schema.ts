import * as mongoose from 'mongoose';
import { LevelType } from '../../domain/levelType';
import { Configs } from '../../config/config';

export const CategorySchema = new mongoose.Schema({
  name: String,
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: Configs.providers.product }],
  parent: { type: mongoose.Schema.Types.ObjectId, ref: Configs.providers.category },
  // children: [{ type: mongoose.Schema.Types.ObjectId, ref: Configs.providers.category }],
  level: {type: Number, enum: Object.values(LevelType)}
});
