import { Expose } from 'class-transformer';
import { LevelType } from '../../domain/levelType';

export class DbQueryCategory {
  @Expose() name: string;
  @Expose() level: LevelType;
  @Expose() parent: DbQueryCategory = null;
}