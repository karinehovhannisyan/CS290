import { Configs } from '../../config/config';
import { CategorySchema } from '../schemas/category.schema';

export const categoryProviders = [
  {
    name: Configs.providers.category,
    useFactory: () => {
      const schema = CategorySchema;
      schema.virtual('children', {
        ref: Configs.providers.category,
        localField: '_id',
        foreignField: 'parent',
        justOne: false,
      });
      return schema;
    },
  },
];