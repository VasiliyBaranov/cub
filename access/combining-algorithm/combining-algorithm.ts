import {AccessStateAccessPoliyEnum} from '../enums/access.state-access-poliy.enum';
import {AccessCombiningAlgorithmEnum} from '../enums/access.combining-algorithm.enum';


export class CombiningAlgorithm {
  static init(listAccess: AccessStateAccessPoliyEnum[], combine: AccessCombiningAlgorithmEnum): AccessStateAccessPoliyEnum {
    if (combine) {
      switch (combine) {
        case  AccessCombiningAlgorithmEnum.permitUnlessDeny:
          return CombiningAlgorithm.permitUnlessDenyCombiningAlgorithm(listAccess);
        case  AccessCombiningAlgorithmEnum.denyUnlessPermit:
          return CombiningAlgorithm.denyUnlessPermitCombiningAlgorithm(listAccess);
      }
    }
    return AccessStateAccessPoliyEnum.indeterminate;
  }


  /**
   * Алгоритм комбинирование разрешено, если не запрещено
   *
   * @param listAccess массив строковых значений.
   * return возвращает PERMIT если все значения из listAccess будут PERMIT
   */
  private static permitUnlessDenyCombiningAlgorithm(listAccess: AccessStateAccessPoliyEnum[]): AccessStateAccessPoliyEnum {
    for (const access of listAccess) {
      switch (access) {
        case AccessStateAccessPoliyEnum.deny:
        case AccessStateAccessPoliyEnum.notApplicable:
        case AccessStateAccessPoliyEnum.indeterminate:
          return AccessStateAccessPoliyEnum.deny;
      }
    }
    return AccessStateAccessPoliyEnum.permit;
  }


  /**
   * Алгоритм комбинирование запрещено, если не разрешено
   *
   * @param listAccess массив строковых значений.
   * return возвращает PERMIT если одно любое значение из listAccess будут PERMIT
   */
  private static denyUnlessPermitCombiningAlgorithm(listAccess: AccessStateAccessPoliyEnum[]): AccessStateAccessPoliyEnum {
    for (const access of listAccess) {
      if (access === AccessStateAccessPoliyEnum.permit) {
        return AccessStateAccessPoliyEnum.permit;
      }
    }
    return AccessStateAccessPoliyEnum.deny;
  }
}
