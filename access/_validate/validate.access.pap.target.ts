import {registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface} from 'class-validator';
import {AccessTargetForValidatePap} from '../../access-target/access.target-for-validate-pap';
import { ITarget } from './validate.interface';


@ValidatorConstraint({async: true})
class IsTargetConstraint implements ValidatorConstraintInterface {
  // private attrsHandler: AttributeHandler;

  constructor() {
    // this.attrsHandler = Container.get(AttributeHandler);
  }


  async validate(target: any | ITarget, args: ValidationArguments): Promise<boolean> {
    const targetValidate = new AccessTargetForValidatePap();
    return await targetValidate.validateTarget(target.accessAttribute, target.action, target.detail);
  }


  defaultMessage(args: ValidationArguments): string {
    return 'Текущий target не валиден, не найден подходящий коннектор!' + args.value;
  }
}

export function isTarget(property: string, validationOptions?: ValidationOptions): any {
  return (object: object, propertyName: string) => {
    registerDecorator({
      name: 'isTarget',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: IsTargetConstraint
    });
  };
}
