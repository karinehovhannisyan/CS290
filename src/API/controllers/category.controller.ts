import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { Roles } from '../validation/roles';
import { UserRoles } from '../types/userRoles';
import { CategoryCreationDto } from '../../application/models/categoryCreationDto';
import { CategoryService } from '../../application/services/category.service';
import { CategoryDto } from '../../application/models/categoryDto';
import { ApiTags } from '@nestjs/swagger';
import { PagedListHolder } from '../../application/extentions/pagedListHolder';
import { RolesGuard } from '../middleware/rolesGuard';
import { AuthGuard } from '@nestjs/passport';
const ObjectId = require("mongoose").Types.ObjectId;
@Controller('categories')
@ApiTags('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {
  }

  @Post()
  @Roles(UserRoles.admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  public async addNewCategoryAsync(@Body() categoryCreationDto: CategoryCreationDto): Promise<CategoryDto> {
    return await this.categoryService.addNewCategoryAsync(categoryCreationDto);
  }

  @Get()
  @Roles(UserRoles.guest, UserRoles.user, UserRoles.admin)
  @UseGuards(RolesGuard)
  public async getCategoriesPagedAsync(
    @Query('q') q: string,
    @Query('offset') offset,
    @Query('limit') limit,
  ): Promise<PagedListHolder<CategoryDto>> {
    return await this.categoryService.  getPagedAsync(q, parseInt(offset), parseInt(limit));
  }

  @Get(':id')
  @Roles(UserRoles.guest, UserRoles.user, UserRoles.admin)
  @UseGuards(RolesGuard)
  public async getByIdAsync(@Param('id') id: string): Promise<CategoryDto> {
    return await this.categoryService.getByIdAsync(new ObjectId(id));
  }

  @Delete(':id')
  @Roles(UserRoles.admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  public async deleteAsync(@Param('id') id: string): Promise<void> {
    await this.categoryService.removeAsync(new ObjectId(id));
  }

  @Patch(':id')
  @Roles(UserRoles.admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  public async editAsync(@Param('id') id: string, @Body("name") name: string): Promise<CategoryDto> {
    return await this.categoryService.editAsync(new ObjectId(id), name);
  }
}
