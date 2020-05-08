import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Roles } from '../validation/roles';
import { UserRoles } from '../types/userRoles';
import { OrderCreationDto } from '../../application/models/orderCreationDto';
import { OrderService } from '../../application/services/order.service';
import { OrderDto } from '../../application/models/orderDto';
import { ApiTags } from '@nestjs/swagger';
import { PagedListHolder } from '../../application/extentions/pagedListHolder';
import { RolesGuard } from '../middleware/rolesGuard';
import { AuthGuard } from '@nestjs/passport';

const ObjectId = require('mongoose').Types.ObjectId;

@Controller('orders')
@ApiTags('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {
  }

  @Post()
  @Roles(UserRoles.user)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  public async addNewOrderAsync(@Body() orderCreationDto: OrderCreationDto, @Req() req): Promise<OrderDto> {
    if (!req.user)
      throw new UnauthorizedException();
    return await this.orderService.addNewOrderAsync(req.user._id, orderCreationDto);
  }

  @Get()
  @Roles(UserRoles.admin)
  @UseGuards(RolesGuard)
  public async getOrdersPagedAsync(
    @Query('q') q: string,
    @Query('offset') offset,
    @Query('limit') limit,
    @Request() req
  ): Promise<PagedListHolder<OrderDto>> {
    return await this.orderService.getPagedAsync(q, parseInt(offset), parseInt(limit), req.user && req.user.role === UserRoles.user ? req.user._id : null);
  }

  @Get(':id')
  @Roles(UserRoles.guest, UserRoles.user, UserRoles.admin)
  @UseGuards(RolesGuard)
  public async getByIdAsync(@Param('id') id: string, @Request() req): Promise<OrderDto> {
    return await this.orderService.getByIdAsync(new ObjectId(id), req.user && req.user.role === UserRoles.user ? req.user._id : null);
  }

  @Delete(':id')
  @Roles(UserRoles.admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  public async deleteAsync(@Param('id') id: string): Promise<void> {
    await this.orderService.removeAsync(new ObjectId(id));
  }
}
