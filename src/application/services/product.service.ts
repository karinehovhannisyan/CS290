import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Model, ObjectId } from 'mongoose';
import { Configs } from '../../config/config';
import { Mapper } from '../extentions/mapper';
import { InjectModel } from '@nestjs/mongoose';
import { ProductDocument } from '../../infrastructure/models/interfaces/productDocument';
import { ProductCreationDto } from '../models/productCreationDto';
import { DbQueryProduct } from '../../infrastructure/models/dbQueryProduct';
import { DbInsertionProduct } from '../../infrastructure/models/dbInsertionProduct';
import { ProductDto } from '../models/productDto';
import { PagedListHolder } from '../extentions/pagedListHolder';
import { CategoryDocument } from '../../infrastructure/models/interfaces/categoryDocument';
import { LevelType } from '../../domain/levelType';

const ObjectID = require("mongoose").Types.ObjectId;
@Injectable()
export class ProductService {
  constructor(@InjectModel(Configs.providers.product) private productModel: Model<ProductDocument>,
              @InjectModel(Configs.providers.category) private categoryModel: Model<CategoryDocument>) {
  }

  public async addNewProductAsync(productCreationDto: ProductCreationDto): Promise<ProductDto> {
    const category = await this.categoryModel.findById(new ObjectID(productCreationDto.category));

    if (!category || category.level == LevelType.parent)
      throw new BadRequestException();

    if (await this.productModel.countDocuments({ name: productCreationDto.name }).exec())
      throw new ConflictException();

    const dbProduct: DbQueryProduct = Mapper.Map(DbQueryProduct, productCreationDto);

    let newProductModel = new this.productModel(dbProduct);
    newProductModel = await newProductModel.save();
    category.products.push(newProductModel._id);
    await category.save();
    return Mapper.Map(ProductDto, newProductModel);
  }

  public async getProductsPagedAsync(categoryId, q, offset, limit): Promise<PagedListHolder<ProductDto>> {
    const searchQuery: any = {};
    if (categoryId) {
      searchQuery.category = categoryId;
    }
    if (q) {
      searchQuery.name = { $regex: new RegExp(`.*${q}.*`, "i") };
    }
    const count = await this.productModel.countDocuments(searchQuery).exec();
    const products = await this.productModel.find(searchQuery).sort([['updatedAt', -1]]).limit(limit).skip(offset).exec();

    return new PagedListHolder(Mapper.MapList(ProductDto, products), limit, offset, count);
  }

  public async getByIdAsync(id: ObjectId): Promise<ProductDto> {
    const product = await this.productModel.findById(id);

    if(!product)
      throw new NotFoundException();

    return Mapper.Map(ProductDto, product);
  }

  public async deleteAsync(id: ObjectId): Promise<void> {
    const product = await this.productModel.deleteOne({_id: id}).exec();

    if(!product.deletedCount)
      throw new NotFoundException();
  }

  public async editAsync(productId: ObjectId, productEditDto: ProductCreationDto, storage = 0): Promise<ProductDto> {
    const dbProduct = await this.productModel.findOne({_id: productId}).exec();

    if (!dbProduct)
      throw new NotFoundException();

    const productDomain = Mapper.Map(DbInsertionProduct, productEditDto || dbProduct, true);
    productDomain.category = new ObjectID(dbProduct.category);

    if (storage) {
      productDomain.changeStock(storage);
    }
    Object.assign(dbProduct, productDomain);
    await dbProduct.save();

    return Mapper.Map(ProductDto, dbProduct);
  }

  public async uploadPictureAsync(productId: ObjectId, filename: string): Promise<void> {
    const dbProduct = await this.productModel.findOne({_id: productId}).exec();

    if (!dbProduct)
      throw new NotFoundException();

    const productDomain = Mapper.Map(DbInsertionProduct, dbProduct, true);

    productDomain.category = new ObjectID(dbProduct.category);
    productDomain.image = filename;

    Object.assign(dbProduct, productDomain);

    await dbProduct.save();
  }

  public async deletePictureAsync(productId: ObjectId): Promise<void> {
    const dbProduct = await this.productModel.findOne({_id: productId}).populate("category").exec();

    if (!dbProduct)
      throw new NotFoundException();

    dbProduct.image = null;

    await dbProduct.save();
  }
}
