import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Model, ObjectId } from 'mongoose';
import { Configs } from '../../config/config';
import { Mapper } from '../extentions/mapper';
import { InjectModel } from '@nestjs/mongoose';
import { OrderCreationDto } from '../models/orderCreationDto';
import { DbInsertionOrder } from '../../infrastructure/models/dbInsertionOrder';
import { PagedListHolder } from '../extentions/pagedListHolder';
import { OrderDocument } from '../../infrastructure/models/interfaces/orderDocument';
import { ProductDocument } from '../../infrastructure/models/interfaces/productDocument';
import { UserDocument } from '../../infrastructure/models/interfaces/userDocument';
import * as _ from 'lodash';
import { OrderDto, OrderItemDto } from '../models/orderDto';
import { DbInsertionProduct } from '../../infrastructure/models/dbInsertionProduct';
import { UserDto } from '../models/userDto';
import { DbUser } from '../../infrastructure/models/dbUser';
import { ProductDto } from '../models/productDto';

const ObjectID = require('mongoose').Types.ObjectId;

@Injectable()
export class OrderService {
  constructor(@InjectModel(Configs.providers.order) private orderModel: Model<OrderDocument>,
              @InjectModel(Configs.providers.product) private productModel: Model<ProductDocument>,
              @InjectModel(Configs.providers.user) private userModel: Model<UserDocument>) {
  }

  public async addNewOrderAsync(userId: ObjectId, orderCreationDto: OrderCreationDto): Promise<OrderDto> {
    if (_.size(_.groupBy(orderCreationDto.orderItems, 'product')) !== orderCreationDto.orderItems.length)
      throw new BadRequestException();

    const dbUser = await this.userModel.findById(userId);

    if (!dbUser)
      throw new BadRequestException();

    const user = Mapper.Map(DbUser, dbUser, true);
    const products = await this.productModel.find({ _id: { $in: orderCreationDto.orderItems.map(i => new ObjectID(i.product)) } }).exec();

    for (const p of products) {
      const domainP = Mapper.Map(DbInsertionProduct, p);
      domainP.category = p.category;
      const orderItem = orderCreationDto.orderItems.find(oi => oi.product === p._id.toString());
      if (!orderItem || orderItem.quantity > p.inStorage)
        throw new BadRequestException();
      domainP.changeStock(-orderItem.quantity);
      user.changeBalance(orderItem.quantity * p.price);
      Object.assign(p, domainP);
    }
    for (const p of products) {
      await p.save();
    }
    Object.assign(dbUser, user);
    await dbUser.save();

    const dbOrder: DbInsertionOrder = Mapper.Map(DbInsertionOrder, orderCreationDto);
    let orderModel = new this.orderModel(dbOrder);
    await orderModel.save();
    orderModel = await this.orderModel
      .findOne({ _id: orderModel._id })
      .populate({
        path: 'orderItems',
        populate: { path: 'product' },
      })
      .populate('user')
      .exec();

    return Mapper.Map(OrderDto, orderModel);
  }

  public async removeAsync(catId: ObjectId): Promise<void> {
    const dbOrder = await this.orderModel.findById(catId).exec();

    if (dbOrder) {
      await this.orderModel.deleteOne({ _id: catId }).exec();
    }
  }

  public async getByIdAsync(id: ObjectId, userId: ObjectId): Promise<OrderDto> {
    const order = await this.orderModel.findOne({ _id: id })
      .populate({
        path: 'orders.orderItems'
      }).populate('user')
      .exec();

    if (userId && order.user._id !== userId)
      throw new ForbiddenException();

    if (!order)
      throw new NotFoundException();

    const products = await this.productModel.find({_id: {$in: order.orderItems.map(oi => oi.product)}}).exec();

    const items = Mapper.MapList(OrderItemDto, order.orderItems);
    items.forEach((oi) => {
      oi.product = Mapper.Map(ProductDto, products.find(p => p._id.toString() === oi.product.toString()));
    });
    order.orderItems = [];
    const dto = Mapper.Map(OrderDto, order);
    dto.user = Mapper.Map(UserDto, order.user);
    dto.orderItems = items;
    return dto;
  }

  public async getPagedAsync(q: string, offset: number, limit: number, userId: ObjectId): Promise<PagedListHolder<OrderDto>> {
    const searchQuery: any = {};
    if (q) {
      searchQuery.address = { $regex: new RegExp(`.*${q}.*`, 'i') };
    }
    if (userId) {
      searchQuery.user = userId;
    }
    const count = await this.orderModel.countDocuments(searchQuery).exec();
    const orders = await this.orderModel
      .find(searchQuery)
      .skip(offset)
      .limit(limit)
      .populate({
        path: 'orders.orderItems'
      }).populate('user')
      .exec();

    const products = await this.productModel.find({_id: {$in: orders.map(o => o.orderItems).reduce((a,b) => a.concat(b)).map(r => r.product)}}).exec();
    const orderDtos = orders.map((o) => {
      const items = Mapper.MapList(OrderItemDto, o.orderItems);
      items.forEach((oi) => {
        oi.product = Mapper.Map(ProductDto, products.find(p => p._id.toString() === oi.product.toString()));
      });
      o.orderItems = [];
      const dto = Mapper.Map(OrderDto, o);
      dto.user = Mapper.Map(UserDto, o.user);
      dto.orderItems = items;
      return dto;
    });
    return new PagedListHolder(orderDtos, limit, offset, count);
  }
}
