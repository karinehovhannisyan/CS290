import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth.module';
import { UserModule } from './modules/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Configs } from './config/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';
import { ProductModule } from './modules/product.module';
import { CategoryModule } from './modules/category.module';
import { OrderModule } from './modules/order.module';

@Module({
  imports: [MongooseModule.forRoot(Configs.db.url),
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'public'),
    }),
    UserModule, ProductModule, CategoryModule, OrderModule, AuthModule]
})
export class AppModule {}
