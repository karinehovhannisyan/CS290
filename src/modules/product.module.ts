import { Module } from '@nestjs/common';
import { AuthModule } from './auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductService } from '../application/services/product.service';
import { ProductController } from '../API/controllers/product.controller';
import { productProviders } from '../infrastructure/providers/product.providers';
import { MulterModule } from '@nestjs/platform-express';


@Module({
  imports: [MulterModule.register({
    dest: './public/products',
  }),
    MongooseModule.forFeatureAsync(productProviders)],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {
}
