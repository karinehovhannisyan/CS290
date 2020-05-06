import { Configs } from '../../config/config';
import { UserSchema } from '../schemas/user.schema';

export const userProviders = [
  {
    name: Configs.providers.user,
    useFactory: () => {
      const schema = UserSchema;
      schema.pre('save', function (next) {
        this.updatedAt = new Date();
        next();
      });
      return schema;
    },
  },
];