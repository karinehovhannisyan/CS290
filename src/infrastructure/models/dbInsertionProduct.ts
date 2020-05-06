import { DbProductBase } from './dbProduct';
import { Expose } from 'class-transformer';
import { ObjectId } from 'mongoose';

export class DbInsertionProduct extends DbProductBase {
  @Expose() category;
}