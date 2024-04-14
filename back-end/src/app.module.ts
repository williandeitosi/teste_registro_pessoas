import { Module } from '@nestjs/common';
import { PersonModule } from './person/person.module';
import { AddressModule } from './address/address.module';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [PersonModule, AddressModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
