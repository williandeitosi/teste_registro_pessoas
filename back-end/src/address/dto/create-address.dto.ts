import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateAddressDto {
  @IsNotEmpty()
  @IsNumber()
  personId: number;

  @IsNotEmpty()
  @IsString()
  cep: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsString()
  number: string;

  @IsOptional()
  @IsString()
  complement?: string;

  @IsNotEmpty()
  @IsString()
  neighborhood: string;

  @IsNotEmpty()
  @IsString()
  state: string;

  @IsNotEmpty()
  @IsString()
  city: string;
}
