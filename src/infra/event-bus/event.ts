import { Event } from './event-bus.interface'

export abstract class BaseEvent implements Event {
  abstract type: string;
}