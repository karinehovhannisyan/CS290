import { PerType } from '../../../domain/perType';

export interface ProductDocument extends Document {
  name: string;
  category;
  description: string;
  price: number;
  inStorage: number;
  per: PerType;
  image: string;
}