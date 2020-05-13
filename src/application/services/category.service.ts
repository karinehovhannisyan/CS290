import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Model, ObjectId } from 'mongoose';
import { Configs } from '../../config/config';
import { Mapper } from '../extentions/mapper';
import { InjectModel } from '@nestjs/mongoose';
import { CategoryDocument } from '../../infrastructure/models/interfaces/categoryDocument';
import { CategoryCreationDto } from '../models/categoryCreationDto';
import { LevelType } from '../../domain/levelType';
import { DbInsertionCategory } from '../../infrastructure/models/dbInsertionCategory';
import { CategoryDto } from '../models/categoryDto';
import { PagedListHolder } from '../extentions/pagedListHolder';

const ObjectID = require('mongoose').Types.ObjectId;

@Injectable()
export class CategoryService {
  constructor(@InjectModel(Configs.providers.category) private categoryModel: Model<CategoryDocument>) {
  }

  public async addNewCategoryAsync(categoryCreationDto: CategoryCreationDto): Promise<CategoryDto> {
    if (categoryCreationDto.level === LevelType.child && !categoryCreationDto.parent)
      throw new BadRequestException();

    if (await this.categoryModel.countDocuments({ name: categoryCreationDto.name }).exec())
      throw new ConflictException();

    if (categoryCreationDto.level === LevelType.child) {
      const parent = await this.categoryModel.findById(new ObjectID(categoryCreationDto.parent));

      if (!parent)
        throw new NotFoundException();

      if (parent.level !== LevelType.parent)
        throw new BadRequestException();

      const dbCategory: DbInsertionCategory = Mapper.Map(DbInsertionCategory, categoryCreationDto);
      let categoryModel = new this.categoryModel(dbCategory);
      categoryModel = await categoryModel.save();
      categoryModel._doc.parent = parent._doc;
      return Mapper.Map(CategoryDto, categoryModel);
    } else {
      const dbCategory: DbInsertionCategory = Mapper.Map(DbInsertionCategory, categoryCreationDto);
      let categoryModel = new this.categoryModel(dbCategory);
      categoryModel = await categoryModel.save();
      return Mapper.Map(CategoryDto, categoryModel);
    }
  }

  public async editAsync(catId: ObjectId, name: string): Promise<CategoryDto> {
    if (await this.categoryModel.countDocuments({ name: name, _id: { $ne: catId } }).exec())
      throw new ConflictException();

    const dbCategory = await this.categoryModel.findById(catId);

    if (dbCategory.name === name)
      return Mapper.Map(CategoryDto, dbCategory);

    dbCategory.name = name;
    await dbCategory.save();

    return Mapper.Map(CategoryDto, dbCategory);
  }

  public async removeAsync(catId: ObjectId): Promise<void> {
    const dbCategory = await this.categoryModel.findOne({ _id: catId }).populate('products').populate('children').exec();

    if (dbCategory) {
      if (dbCategory.level === LevelType.parent && dbCategory.children.length || dbCategory.products.length)
        throw new BadRequestException();

      await this.categoryModel.deleteOne({ _id: catId }).exec();
    }
   }

  public async getByIdAsync(id: ObjectId): Promise<CategoryDto> {
    const category = await this.categoryModel.findOne({ _id: id }).populate('children').populate('parent').exec();

    if (!category)
      throw new NotFoundException();

    const dto = Mapper.Map(CategoryDto, category);
    if (category.level == LevelType.parent) {
      dto.children = Mapper.MapList(CategoryDto, category.children);
    } else {
      dto.parent = Mapper.Map(CategoryDto, category.parent);
    }
    return dto;
  }

  public async getPagedAsync(q: string, offset: number, limit: number): Promise<PagedListHolder<CategoryDto>> {
    const searchQuery: any = {level: LevelType.parent};
    if (q) {
      searchQuery.name = { $regex: new RegExp(`.*${q}.*`, "i") };
    }
    const count = await this.categoryModel.countDocuments(searchQuery).exec();
    const categories = await this.categoryModel
      .find(searchQuery)
      .skip(offset)
      .sort([['updatedAt', -1]])
      .limit(limit)
      .populate('children')
      .populate('parent')
      .exec();

    const dtos: CategoryDto[] = [];
    categories.forEach(category => {
      const dto = Mapper.Map(CategoryDto, category);
      dto.children = Mapper.MapList(CategoryDto, category.children);
      dtos.push(dto);
    });
    return new PagedListHolder(dtos, limit, offset, count);
  }
}
