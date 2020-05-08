import { classToPlain, plainToClass } from 'class-transformer';
import { ClassType } from 'class-transformer/ClassTransformer';

export class Mapper {
  public static Map<T, G extends IDocument>(classInstance: ClassType<T>, source: G, deleteUndefined = false): T {
    if (Array.isArray(source)) {
      throw new Error('Invalid input');
    }
    return this.MapEach<T, G>(classInstance, source, deleteUndefined);
  }

  public static MapList<T, G extends IDocument>(classInstance: ClassType<T>, source: G[], deleteUndefined = false): T[] {
    if (Array.isArray(source)) {
      return source.map((s) => this.MapEach<T, G>(classInstance, s, deleteUndefined));
    }
    throw new Error('Invalid input');
  }

  private static MapEach<T, G extends IDocument>(classInstance: ClassType<T>, source: G, deleteUndefined: boolean): T {
    const plainObject = classToPlain(source._doc || source);
    const newClass = plainToClass(classInstance, plainObject, { excludeExtraneousValues: true});
    if (deleteUndefined)
      for (const prop in newClass) {
        if (newClass.hasOwnProperty(prop)) {
          if (newClass[prop] === undefined) delete newClass[prop];
        }
      }
    Mapper.checkForIds(newClass, source);
    return newClass;
  }

  private static checkForIds(newClass, source) {
    for (const prop in newClass) {
      if (newClass.hasOwnProperty(prop)) {
        if (!!newClass[prop] && newClass[prop].hasOwnProperty('_bsontype')) {
          newClass[prop] = source[prop].toString();
        } else if (Array.isArray(newClass[prop])) {
          for (const [i, n] of newClass[prop].entries())
            this.checkForIds(n, source[prop][i]);
        } else if (typeof newClass[prop] === 'object' && newClass[prop] !== null) {
            this.checkForIds(newClass[prop], source[prop]);
        }
      }
    }
  }
}