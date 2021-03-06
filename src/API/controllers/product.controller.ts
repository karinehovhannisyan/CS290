import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UploadedFile, UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Roles } from '../validation/roles';
import { UserRoles } from '../types/userRoles';
const ObjectId =  require('mongoose').Types.ObjectId;
import { ProductCreationDto } from '../../application/models/productCreationDto';
import { ProductService } from '../../application/services/product.service';
import { ProductDto } from '../../application/models/productDto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import * as fs from 'fs';
import * as crypto from 'crypto';
import { Configs } from '../../config/config';
import { ApiTags } from '@nestjs/swagger';
import { PagedListHolder } from '../../application/extentions/pagedListHolder';
import { FileUploadInterceptor } from '../interceptors/fileInterceptor';
import { RolesGuard } from '../middleware/rolesGuard';
import { AuthGuard } from '@nestjs/passport';

@Controller('products')
@ApiTags('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {
  }

  @Post()
  @Roles(UserRoles.admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  public async addNewProductAsync(@Body() productCreationDto: ProductCreationDto): Promise<ProductDto> {
    return await this.productService.addNewProductAsync(productCreationDto);
  }

  @Get()
  @Roles(UserRoles.guest, UserRoles.user, UserRoles.admin)
  @UseGuards(RolesGuard)
  public async getProductsPagedAsync(
    @Query('categoryId') categoryId: string,
    @Query('q') q: string,
    @Query('offset') offset: string,
    @Query('limit') limit: string,
  ): Promise<PagedListHolder<ProductDto>> {
    if (!! categoryId && !ObjectId.isValid(categoryId))
      throw new BadRequestException();
    return await this.productService.getProductsPagedAsync(categoryId ? new ObjectId(categoryId) : null, q, parseInt(offset), parseInt(limit));
  }

  @Get(':id')
  @Roles(UserRoles.guest, UserRoles.user, UserRoles.admin)
  @UseGuards(RolesGuard)
  public async getByIdAsync(@Param('id') id: string): Promise<ProductDto> {
    return await this.productService.getByIdAsync(new ObjectId(id));
  }

  @Delete(':id')
  @Roles(UserRoles.admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  public async deleteAsync(@Param('id') id: string): Promise<void> {
    await this.productService.deleteAsync(new ObjectId(id));
  }

  @Patch(':id')
  @Roles(UserRoles.admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  public async editAsync(@Param('id') id: string, @Body() productEditDto: ProductCreationDto): Promise<ProductDto> {
    return await this.productService.editAsync(new ObjectId(id), productEditDto);
  }

  @Put(':id/image')
  @UseInterceptors(FileUploadInterceptor)
  @Roles(UserRoles.admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  public async uploadPictureAsync(@Param('id') id: string, @UploadedFile() file): Promise<void> {
    await this.productService.uploadPictureAsync(new ObjectId(id), "products/" + file.filename);
  }

  @Delete(':id/image')
  @Roles(UserRoles.admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  public async deletePictureAsync(@Param('id') id: string): Promise<void> {
    await this.productService.deletePictureAsync(new ObjectId(id));
  }

  @Patch(':id/storage')
  @Roles(UserRoles.admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  public async editStorageAsync(@Param('id') id: string, @Body('inStorage') storage: number): Promise<ProductDto> {
    return await this.productService.editAsync(new ObjectId(id), null, storage);
  }
}
