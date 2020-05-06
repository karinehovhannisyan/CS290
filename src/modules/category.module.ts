import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { categoryProviders } from '../infrastructure/providers/category.providers';
import { CategoryService } from '../application/services/category.service';
import { CategoryController } from '../API/controllers/category.controller';


@Module({
  imports: [MongooseModule.forFeatureAsync(categoryProviders)],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {
}
