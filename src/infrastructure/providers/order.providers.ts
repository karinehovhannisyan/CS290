import { Configs } from '../../config/config';
import { OrderSchema } from '../schemas/order.schema';
import { ProductSchema } from '../schemas/product.schema';
import { UserSchema } from '../schemas/user.schema';

export const orderProviders = [
  {
    name: Configs.providers.order,
    useFactory: () => OrderSchema
  },
  {
    name: Configs.providers.product,
    useFactory: () => ProductSchema
  },
  {
    name: Configs.providers.user,
    useFactory: () => UserSchema
  },
];