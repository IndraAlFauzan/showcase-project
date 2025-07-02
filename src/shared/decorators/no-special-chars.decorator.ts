import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function NoSpecialChars(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'NoSpecialChars',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return typeof value === 'string' && /^[A-Za-z0-9\s]+$/.test(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} tidak boleh mengandung karakter khusus`;
        },
      },
    });
  };
}
