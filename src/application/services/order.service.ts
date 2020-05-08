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
import { OrderDto } from '../models/orderDto';
import { DbQueryProduct } from '../../infrastructure/models/dbQueryProduct';
import { DbInsertionProduct } from '../../infrastructure/models/dbInsertionProduct';

const ObjectID = require('mongoose').Types.ObjectId;

@Injectable()
export class OrderService {
  constructor(@InjectModel(Configs.providers.order) private orderModel: Model<OrderDocument>,
              @InjectModel(Configs.providers.product) private productModel: Model<ProductDocument>,
              @InjectModel(Configs.providers.user) private userModel: Model<UserDocument>) {
  }

  public async addNewOrderAsync(orderCreationDto: OrderCreationDto): Promise<OrderDto> {
    if (_.size(_(orderCreationDto.orderItems).groupBy('product')) !== orderCreationDto.orderItems.length)
      throw new BadRequestException();

    const user = await this.userModel.findById(new ObjectID(orderCreationDto.user));

    if (!user)
      throw new BadRequestException();

    const products = await this.productModel.find({ _id: { $in: orderCreationDto.orderItems.map(i => new ObjectID(i.product)) } }).exec();

    for (const p of products) {
      const domainP = Mapper.Map(DbInsertionProduct, p);
      domainP.category = p.category;
      const orderItem = orderCreationDto.orderItems.find(oi => oi.product === p._id);
      if (!orderItem || orderItem.quantity > p.inStorage)
        throw new BadRequestException();
      domainP.changeStock(-orderItem.quantity);
      Object.assign(p, domainP);
      await p.save();
    }
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
        path: 'orderItems',
        populate: { path: 'product' },
      }).populate('user')
      .exec();

    if (userId && order.user._id !== userId)
      throw new ForbiddenException();

    if (!order)
      throw new NotFoundException();

    return Mapper.Map(OrderDto, order);
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
        path: 'orderItems',
        populate: { path: 'product' },
      }).populate('user')
      .exec();

    return new PagedListHolder(Mapper.MapList(OrderDto, orders), limit, offset, count);
  }
}
