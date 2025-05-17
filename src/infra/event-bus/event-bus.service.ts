import { Inject, Injectable } from '@nestjs/common';
import { EventBus, Event } from './event-bus.interface';

@Injectable()
export class EventBusService {
  constructor(
    @Inject('EVENT_BUS') private readonly eventBus: EventBus,
  ) {}

  async publish<T extends Event>(event: T): Promise<void> {
    await this.eventBus.publish(event);
  }

  subscribe<T extends Event>(
    eventType: new (...args: any[]) => T,
    handler: (event: T) => Promise<void> | void,
  ) {
    this.eventBus.subscribe(eventType, handler);
  }
}