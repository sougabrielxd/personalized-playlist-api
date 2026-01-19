import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ValidationPipe implements PipeTransform<unknown, unknown> {
  async transform(value: unknown, { metatype }: ArgumentMetadata): Promise<unknown> {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    const object = plainToInstance(metatype, value);
    const errors = await validate(object as object);

    if (errors.length > 0) {
      const messages = errors.map((error) => Object.values(error.constraints || {}).join(', '));
      throw new BadRequestException(messages.join('; '));
    }

    return object;
  }

  private toValidate(metatype: unknown): metatype is new () => unknown {
    const types: (new () => unknown)[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype as new () => unknown);
  }
}
