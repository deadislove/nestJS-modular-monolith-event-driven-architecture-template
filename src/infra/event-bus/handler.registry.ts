const registry = new Map<any, any[]>();

export class HandlerRegistry {
  static register(eventClass: any, handlerClass: any) {
    if (!registry.has(eventClass)) {
      registry.set(eventClass, []);
    }
    registry.get(eventClass)!.push(handlerClass);
  }

  static getAll() {
    return registry;
  }
}