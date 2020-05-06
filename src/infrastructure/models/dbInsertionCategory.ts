import { Expose } from 'class-transformer';
import { LevelType } from '../../domain/levelType';
import {ObjectId} from "mongoose";

export class DbInsertionCategory {
  @Expose() name: string;
  @Expose() level: LevelType;
  @Expose() parent: ObjectId;
}