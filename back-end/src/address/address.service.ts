import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { validate } from 'class-validator';

@Injectable()
export class AddressService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateAddressDto) {
    const errors = await validate(data);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    const newAddress = await this.prisma.address.create({ data });
    return newAddress;
  }

  findAll() {
    return this.prisma.address.findMany();
  }

  async findOne(id: number) {
    const idExists = await this.prisma.address.findUnique({
      where: { id },
    });

    if (!idExists) {
      throw new NotFoundException(`ID: ${id} não existe`);
    }

    return idExists;
  }

  async update(id: number, data: UpdateAddressDto) {
    const idExists = await this.prisma.address.findUnique({
      where: { id },
    });

    if (!idExists) {
      throw new NotFoundException(`Pessoa com ID ${id} não encontrada`);
    }

    const errors = await validate(data);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    const addressUpdate = await this.prisma.address.update({
      where: { id },
      data,
    });

    return addressUpdate;
  }

  async remove(id: number) {
    const idExists = await this.prisma.address.findUnique({
      where: { id },
    });

    if (!idExists) {
      throw new NotFoundException(`Pessoa com ID ${id} não encontrada`);
    }

    await this.prisma.address.delete({
      where: { id },
    });

    return { message: `Endereço com ID: ${id} excluído com sucesso!` };
  }
}
