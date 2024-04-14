import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { validate } from 'class-validator';

@Injectable()
export class PersonService {
  constructor(private prisma: PrismaService) {}

  async create(createPersonDto: CreatePersonDto) {
    try {
      const errors = await validate(createPersonDto);
      if (errors.length > 0) {
        throw new BadRequestException(errors);
      }
      console.log('Dados do DTO:', createPersonDto);
      const { name, gender, dataOfBirth, maritalStatus } = createPersonDto; // Desestruturação dos dados do DTO

      const person = await this.prisma.person.create({
        data: {
          name,
          gender,
          dataOfBirth,
          maritalStatus,
        },
      });

      return person;
    } catch (error) {
      throw new Error(`Erro ao criar pessoa: ${error.message}`);
    }
  }

  findAll() {
    return this.prisma.person.findMany();
  }

  async findOne(id: number) {
    const person = await this.prisma.person.findUnique({
      where: { id },
    });

    if (!person) {
      throw new NotFoundException(`ID: ${id} não existe`);
    }

    return person;
  }

  async getAddress(id: number) {
    const address = await this.prisma.address.findMany({
      where: { personId: id },
    });

    return address;
  }

  async update(id: number, updatePersonDto: UpdatePersonDto) {
    const existingPerson = await this.prisma.person.findUnique({
      where: { id },
    });

    if (!existingPerson) {
      throw new NotFoundException(`Pessoa com ID ${id} não encontrada`);
    }

    const errors = await validate(updatePersonDto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    const updatedPerson = await this.prisma.person.update({
      where: { id },
      data: updatePersonDto,
    });

    return updatedPerson;
  }

  async remove(id: number) {
    const existingPerson = await this.prisma.person.findUnique({
      where: { id },
    });

    if (!existingPerson) {
      throw new NotFoundException(`Pessoa com ID ${id} não encontrada`);
    }

    await this.prisma.person.delete({
      where: { id },
    });

    return { message: `Usuário com ID: ${id} excluído com sucesso!` };
  }
}
