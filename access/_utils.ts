import {IFlatData} from './acceess.interface';
import {Condition} from './condition/condition';
import {Rule} from './rule/rule';
import {Policy} from './policy/policy';
import {AccessContext} from './access.context';
import {PolicySet} from './policy-set/policy-set';

export class Utils {


  /**
   * Формирование плоского массива на основе контекста и всех политик из PAP
   *
   * Плоский массив после текущий обработки примет следующий вид: [
   *  attr: Текущий объект представляет из себя одно из полей Condition attribute | valueAttribute.
   *  По текущему значению в дальнейшем произойдёт группировка для дальнейшего обращения в БД
   *  condition: конкретный Condition для поля attr
   *  context: полный элемент контекста, обратить внимание что el могут дублироваться, уникальное значение должно состоять из
   *  el и currentUser и target и actionType
   * ]
   *
   * @param data сюда поступает весь контекст мутированый в PDP при мутировании для контекста была добавлена модель Policy | PolicySet
   * return результат будет групированный flatData по attr.accessEntity
   */
  public static prepareFlatData(data: AccessContext[]): { [key: string]: IFlatData[] } {
    let flatAttrContext = [] as IFlatData[];
    data.forEach(el => {
      const listPolicy = Array.isArray(el.policy.policy) ? el.policy.policy : [el.policy];
      listPolicy.forEach((policy: Policy) => {
        flatAttrContext = flatAttrContext.concat(this.findRule(policy, el));
      });
      if (el.policy.policySet) {
        const listPolicyGroup = el.policy.policySet;

        listPolicyGroup.forEach((policySet: PolicySet) => {
          policySet.policy.forEach((policy: Policy) => {
            flatAttrContext = flatAttrContext.concat(this.findRule(policy, el));
          });
        });
      }

    });
    return Utils.groupByFlatData(flatAttrContext);
  }


  private static findRule(policy: Policy, ctx: AccessContext): IFlatData[] {
    const flatAttrContext = [] as IFlatData[];
    policy.rule.forEach((rule: Rule) => {
      rule.condition.forEach((con: Condition) => {
        let el = {attr: con.attribute, context: ctx, condition: con};
        flatAttrContext.push(el);
        if (con.valueAttribute != null) {
          el = {attr: con.valueAttribute, context: ctx, condition: con};
          flatAttrContext.push(el);
        }
      });
    });
    return flatAttrContext;
  }


  /**
   * Группировка готового массива из prepareFlatData()
   *
   * После того как prepareFlatData() обработает весь контекст. Для PIP необходимо сформировать сгруппированный массив и убрать
   * дублирующие attr они же attribute и valueAttribute из Condition.
   *
   * @param flatData
   * return после обработкки результат будет иметь следующий вид: [
   *    key: IFlatData[]
   *  ]
   *  key будет одно из значений attr.accessEntity пример: Task | TaskTree | TaskUserTree | User | CurrentUser ......
   *  Значение для key всё тот же массив из prepareFlatData() только группированный по attr.accessEntity.
   */
  public static groupByFlatData(flatData: IFlatData[]): { [key: string]: IFlatData[] } {
    return flatData.reduce((r: { [key: string]: any[] }, a) => {
      const key = a.attr.getEntity();
      if (key) {
        r[key] = [...r[key] || [], a];
      }
      return r;
    }, {} as { [key: string]: IFlatData[] });
  }

}
