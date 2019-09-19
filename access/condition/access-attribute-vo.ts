export class AccessAttributeVo {
  private _resultValue?: any;
  private readonly accessEntity?: string;
  private readonly accessEntityAttr?: string;
  private readonly param?: {[key: string]: any};


  constructor(options: { attr: string, param: object } | number | string | boolean) {
    if (typeof options === 'string') {
      this._resultValue = Array.isArray(options) ? options : [options];
      return;
    }
    if (typeof options === 'number') {
      this._resultValue = Array.isArray(options) ? options : [options];
      return;
    }
    if (typeof options === 'boolean') {
      this._resultValue = Array.isArray(options) ? options : [options];
      return;
    }
    if (typeof options === 'object' && options.attr) {
      this.accessEntity = options.attr.split('.')[0];
      this.accessEntityAttr = options.attr.split('.')[1];
      this.param = options.param != null ? options.param : undefined;
      return;
    }

    throw new Error('Некорректные параметры:' + options);
  }


  public getEntityAttr(): string | undefined {
    return this.accessEntityAttr;
  }


  public getParam(): {[key: string]: any} | undefined {
    return this.param;
  }


  public getEntity(): string | undefined {
    return this.accessEntity;
  }


  getResultValue(): any {
    return this._resultValue;
  }


  public setResultValue(result: any): void {
    this._resultValue = result;
  }
}
