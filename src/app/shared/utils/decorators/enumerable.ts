export function DdEnumerable(value = true) {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    // console.debug('DdEnumerable', target, propertyKey, descriptor);
    descriptor.enumerable = value;
  };
}
