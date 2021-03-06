import { Configs } from '../../config/config';
import { ProductSchema } from '../schemas/product.schema';
import { CategorySchema } from '../schemas/category.schema';

export const productProviders = [
  {
    name: Configs.providers.product,
    useFactory: () => ProductSchema
  },
  {
    name: Configs.providers.category,
    useFactory: () => {
      const schema = CategorySchema;
      schema.pre('save', function(next) {
        this.updatedAt = new Date();
        next();
      });
      return schema;
    }
  },
];