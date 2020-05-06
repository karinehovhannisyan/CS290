import { LevelType } from '../../../domain/levelType';

export interface CategoryDocument extends Document {
  name: string;
  level: LevelType;
  parent;
  children;
  products;
}