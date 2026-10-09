import { Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { envs } from '../config/envs.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';
import { PrismaClient } from '../generated/prisma/client.js';
import { PaginationDto } from '../common/index.js';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {

  private readonly logger = new Logger('ProductService');

  constructor() {
    const adapter = new PrismaBetterSqlite3({ url: envs.databaseUrl });
    super({ adapter });
  }

  onModuleInit() {
    this.$connect();
    this.logger.log('Database connected');
  }


  //* Create a new product
  create(createProductDto: CreateProductDto) {

    // product -> modelo de PrismaClient
    return this.product.create({
      data: createProductDto
    }) 
  }


  //* Find all products with pagination
  async findAll(paginationDto: PaginationDto) {

    const { page = 1, limit = 10 } = paginationDto;
    const total = await this.product.count();
    const lastPage = Math.ceil(total / limit);

    return {
      data: await this.product.findMany({
        where: { availabe: true },
        skip: (page - 1) * limit,
        take: limit
      }),
      meta: {
        total,
        page,
        lastPage
      }
    };
  }


  //* Find a product by ID
  async findOne(id: string) {

    const product = await this.product.findFirst({
      where: { id, availabe: true }
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;

  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    
    const { id: _, ...data } = updateProductDto;

    await this.findOne(id);

    return this.product.update({
      where: { id },
      data
    });

  }

  //* Delete a product by ID
  async remove(id: string) {

    await this.findOne(id);    

    // return this.product.delete({
    //   where: { id }
    // });

    // logical delete
    const product = await this.product.update({
      where: { id },
      data: { availabe: false }
    });

    return product;

  }
}
