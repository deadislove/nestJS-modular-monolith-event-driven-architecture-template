import { EventBus } from './event-bus.interface';
import { InMemoryEventBus } from './brokers/in-memory.bus';
import { RedisEventBus } from './brokers/redis.bus';
import { KafkaEventBus } from './brokers/kafka.bus';
import { HandlerRegistry } from './handler.registry';
import { ConfigService } from '@nestjs/config';
import { ModuleRef } from '@nestjs/core';
import { RedisStreamEventBus } from './brokers/redisStream.bus';

export enum EventBusType {
  Kafka = 'kafka',
  Redis = 'redis',
  Memory = 'memory',
}

export const createEventBus = async (
  config: ConfigService,
  moduleRef: ModuleRef,
): Promise<EventBus> => {
  const type = config.get<EventBusType>('EVENT_BUS_TYPE');
  let eventBus: EventBus;

  switch (type) {
    case EventBusType.Kafka:
      eventBus = new KafkaEventBus(config.get<string>('KAFKA_BROKER', ''));
      break;
    case EventBusType.Redis:
      // eventBus = new RedisStreamEventBus(config.get<string>('REDIS_URL', '')); Optional
      eventBus = new RedisEventBus(config.get<string>('REDIS_URL', ''));
      break;
    default:
      eventBus = new InMemoryEventBus();
  }

  for (const [eventClass, handlers] of HandlerRegistry.getAll()) {
    for (const HandlerClass of handlers) {
      const instance = moduleRef.get(HandlerClass, { strict: false });
      if (!instance) throw new Error(`Handler ${HandlerClass.name} not found`);
      eventBus.subscribe(eventClass as any, (event: any) =>
        instance.handle(event),
      );
    }
  }

  return eventBus;
};