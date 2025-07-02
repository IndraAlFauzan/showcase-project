import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function OnlyNumber(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'OnlyNumber',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return typeof value === 'string' && /^[0-9]+$/.test(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} hanya boleh berisi angka saja`;
        },
      },
    });
  };
}
