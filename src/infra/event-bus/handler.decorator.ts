import { HandlerRegistry } from './handler.registry';
import { Event } from './event-bus.interface';

export function EventHandler(eventClass: new (...args: any[]) => Event) {
  return function (target: any) {
    HandlerRegistry.register(eventClass, target);
  };
}