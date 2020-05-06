import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderService } from '../application/services/order.service';
import { OrderController } from '../API/controllers/order.controller';
import { orderProviders } from '../infrastructure/providers/order.providers';


@Module({
  imports: [MongooseModule.forFeatureAsync(orderProviders)],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {
}
