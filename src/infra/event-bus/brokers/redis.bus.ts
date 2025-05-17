import { EventBus } from '../event-bus.interface';
import Redis from 'ioredis';
import { Event } from '../event-bus.interface';

export class RedisEventBus implements EventBus {
  private publisher: Redis;
  private subscriber: Redis;

  constructor(redisUrl: string) {
    this.publisher = new Redis(redisUrl);   
    this.subscriber = new Redis(redisUrl); 
  }

  async publish<T extends Event>(event: T): Promise<void> {
    const channel = event.constructor.name;
    const data = JSON.stringify(event);
    await this.publisher.publish(channel, data);
  }

  subscribe<T extends Event>(
    eventType: new (...args: any[]) => T,
    handler: (event: T) => void | Promise<void>
  ) {
    const channel = eventType.name;
    this.subscriber.subscribe(channel);
    this.subscriber.on('message', (chan, message) => {
      if (chan === channel) {
        const payload = JSON.parse(message);
        const eventInstance = Object.assign(new eventType(), payload);
        handler(eventInstance);
      }
    });
  }
}