import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isDecimalMax', async: false })
export class IsDecimalMaxConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const [maxDecimalDigits] = args.constraints;

    if (typeof value !== 'number') return false

    const decimalPart = value.toString().split('.')[1]
    
    if (decimalPart && decimalPart.length > maxDecimalDigits) {
      return false
    }

    return true
  }

  defaultMessage(args: ValidationArguments) {
    const [maxDecimalDigits] = args.constraints;
    return `Число должно содержать не более ${maxDecimalDigits} знаков после запятой`
  }
}

export function IsDecimalMax(
  maxDecimalDigits: number,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [maxDecimalDigits],
      validator: IsDecimalMaxConstraint,
    })
  }
}