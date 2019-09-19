import {registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface} from 'class-validator';
import {AccessConnectorContainer} from '../../access-pip-connector/access.connector.container';
import {IStructureConnector} from '../acceess.interface';

interface IAttribute {
  attr: string;
  param?: { [key: string]: any };
}

@ValidatorConstraint({async: true})
class ValidateAccessPapAttribute implements ValidatorConstraintInterface {
  // private attrsHandler: AttributeHandler;


  constructor() {
    // this.attrsHandler = Container.get(AttributeHandler);
  }


  private validParam(structure: IStructureConnector[], param?: { [key: string]: any }): boolean {
    if (!param) {
      return true;
    }
    for (const key of Object.keys(param)) {
      const isField = structure.find(s => s.field === key);
      if (isField) {
        let typeVal = [] as string[];
        switch (typeof param[key]) {
          case 'string':
            typeVal = ['text', 'varchar'];
            break;
          case 'number':
            typeVal = ['int', 'bigint'];
            break;
          case 'boolean':
            typeVal = ['boolean'];
            break;
        }
        if (!typeVal.includes(isField.type)) {
          return false;
        }
      } else {
        return false;
      }

    }
    return true;
  }

  async validate(attribute: any | IAttribute, args: ValidationArguments): Promise<boolean> {
    if (typeof attribute === 'object') {
      const entity = attribute.attr.split('.')[0];
      const field = attribute.attr.split('.')[1];
      const structure = AccessConnectorContainer.getStructure(entity);
      const isFieldForEntity = !!structure.find(s => s.field === field);
      const validParam = this.validParam(structure, attribute.param);
      if (isFieldForEntity && validParam) {
        return true;
      }
    } else {
      return true;
    }
    return false;
  }


  defaultMessage(): string {
    return 'Текущий attribute не валиден!';
  }
}

export function isAccessPapAttribute(property: string, validationOptions?: ValidationOptions): any {
  return (object: object, propertyName: string) => {
    registerDecorator({
      name: 'isAccessPapAttribute',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: ValidateAccessPapAttribute
    });
  };
}
