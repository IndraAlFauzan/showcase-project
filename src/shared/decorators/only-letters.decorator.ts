import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function OnlyLetters(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'OnlyLetters',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return typeof value === 'string' && /^[A-Za-z\s]+$/.test(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} hanya boleh berisi huruf dan spasi`;
        },
      },
    });
  };
}
