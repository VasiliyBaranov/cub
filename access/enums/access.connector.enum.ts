/* tslint:disable */
import { registerEnumType } from 'type-graphql';
import {AccessConnectorContainer} from '../../access-pip-connector/access.connector.container';


/**
 * Формирование динамического Enum
 *
 * В AccessConnectorContainer формируются динамические клссы такие как:
 *    1) AccessPipConnectorTask
 *    2) AccessCurrentUser
 *    3) BooleanScalar
 * значения этих классов мы подготавливаем для нашего 'пользовательского enum'
 * Т.к. в текущей версии TypeScript отсутсвует возможность формировать методы внтури Enum, было принято решение о
 * создании пользовательской функции. Основа реализации текущей функции, используется на аналоге скомпилированного Enum.
 */
export let AccessConnectorEnum: any;
(function(AccessConnectorEnum) {
  AccessConnectorContainer.getConnectorKeys()
    .forEach((key) => {
      AccessConnectorEnum[key] = key;
    });
})(AccessConnectorEnum = {} as any);


registerEnumType(AccessConnectorEnum, {
  name: 'accessConnectorEnum' // this one is mandatory
});
