import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function TrimmedString(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'TrimmedString',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return typeof value === 'string' && value.trim().length > 0;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} tidak boleh kosong atau hanya spasi`;
        },
      },
    });
  };
}
