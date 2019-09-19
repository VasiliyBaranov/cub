export class ConditionEqual {
  public static checkOperatorIn(leftAttr: any[], rightAttr: any[]): boolean {
    let state = false;
    for (const item of leftAttr) {
      if (rightAttr.includes(item)) {
        state = true;
        break;
      }
    }
    return state;
  }
}
