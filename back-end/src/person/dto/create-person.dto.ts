import { IsNotEmpty, IsString, IsIn, IsDate } from 'class-validator';

export class CreatePersonDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(['male', 'female', 'other'])
  gender: string;

  @IsNotEmpty()
  @IsDate()
  dataOfBirth: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(['single', 'married', 'divorced', 'widowed'])
  maritalStatus: string;
}
