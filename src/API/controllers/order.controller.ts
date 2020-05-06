import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { Roles } from '../validation/roles';
import { UserRoles } from '../types/userRoles';
import { OrderCreationDto } from '../../application/models/orderCreationDto';
import { OrderService } from '../../application/services/order.service';
import { OrderDto } from '../../application/models/orderDto';
import { ApiTags } from '@nestjs/swagger';
import { PagedListHolder } from '../../application/extentions/pagedListHolder';

const ObjectId = require("mongoose").Types.ObjectId;
@Controller('orders')
@ApiTags('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {
  }

  @Post()
  @Roles(UserRoles.user, UserRoles.guest)
  //@UseGuards(AuthGuard('jwt'), RolesGuard)
  public async addNewOrderAsync(@Body() orderCreationDto: OrderCreationDto): Promise<OrderDto> {
    return await this.orderService.addNewOrderAsync(orderCreationDto);
  }

  @Get()
  @Roles(UserRoles.guest, UserRoles.user, UserRoles.admin)
  //@UseGuards(RolesGuard)
  public async getOrdersPagedAsync(
    @Query('q') q: string,
    @Query('offset') offset,
    @Query('limit') limit,
  ): Promise<PagedListHolder<OrderDto>> {
    return await this.orderService.getPagedAsync(q, parseInt(offset), parseInt(limit));
  }

  @Get(':id')
  @Roles(UserRoles.guest, UserRoles.user, UserRoles.admin)
  //@UseGuards(RolesGuard)
  public async getByIdAsync(@Param('id') id: string): Promise<OrderDto> {
    return await this.orderService.getByIdAsync(new ObjectId(id));
  }

  @Delete(':id')
  @Roles(UserRoles.admin)
  //@UseGuards(AuthGuard('jwt'), RolesGuard)
  public async deleteAsync(@Param('id') id: string): Promise<void> {
    await this.orderService.removeAsync(new ObjectId(id));
  }
}
