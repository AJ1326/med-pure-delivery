import { HttpParams } from '@angular/common/http';

const STRIP_COMMENTS = /(\/\/.*$)|(\/\*[\s\S]*?\*\/)|(\s*=[^,\)]*(('(?:\\'|[^'\r\n])*')|("(?:\\"|[^"\r\n])*"))|(\s*=[^,\)]*))/gm;
const ARGUMENT_NAMES = /([^\s,]+)/g;

export class Utils {
  public static generateUuid(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      // tslint:disable:no-bitwise
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      // tslint:enable:no-bitwise
      return v.toString(16);
    });
  }

  public static getParamNames(func: Function): Array<string> {
    const fnStr = func.toString().replace(STRIP_COMMENTS, '');
    let result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
    if (result === null) result = [];
    return result;
  }

  public static encodeQueryData(data: any) {
    const ret = [];
    for (const d in data) ret.push(encodeURIComponent(d) + '=' + data[d].toString());
    return ret.join('&');
  }

  public static getHttpParams(paramNames: string[], paramValues: any[]): HttpParams {
    const paramObj = {};
    if (!(paramNames instanceof Array) || !(paramValues instanceof Array)) return new HttpParams();

    for (let i = 0; i < paramNames.length; i++) {
      if (typeof paramValues[i] === 'number') paramObj[paramNames[i]] = paramValues[i].toString();
      else if (paramValues[i]) paramObj[paramNames[i]] = paramValues[i];
    }

    return new HttpParams({
      fromObject: paramObj
    });
  }

  public static bind(self: object, fn: (...args: any[]) => any, ...args: any[]) {
    const curryArgs = arguments.length > 2 ? Array.from(arguments).slice(2) : [];
    if (curryArgs.length > 0)
      return function() {
        return arguments.length ? fn.apply(self, curryArgs.concat(Array.from(arguments))) : fn.apply(self, curryArgs);
      };
    else
      return function() {
        return arguments.length ? fn.apply(self, arguments) : fn.call(self);
      };
  }
}
