import {ICommonContext} from '../context.interface';
import {AccessStateAccessPoliyEnum} from './enums/access.state-access-poliy.enum';
import {ITarget} from './acceess.interface';

export class AccessContext {
  public el: string;
  public currentUser: string;
  public target: ITarget;
  policy?: any;
  access?: AccessStateAccessPoliyEnum;


  constructor(elId: string, target: ITarget, ctx: ICommonContext) {
    this.el = elId;
    this.currentUser = ctx.userId;
    this.target = target;
  }
}
