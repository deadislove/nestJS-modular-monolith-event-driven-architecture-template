import { DynamicModule, Module } from '@nestjs/common';
import { EventBus } from './event-bus.interface';
import { createEventBus } from './event-bus.factory';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ModuleRef } from '@nestjs/core';
import { EventBusService } from './event-bus.service';

@Module({})
export class EventBusModule {
  static register(): DynamicModule {
    return {
      module: EventBusModule,
      imports: [ConfigModule],
      providers: [
        EventBusService,
        {
          provide: 'EVENT_BUS',
          inject: [ConfigService, ModuleRef],
          useFactory: async (config: ConfigService, moduleRef: ModuleRef) => {
            return await createEventBus(config, moduleRef);
          },
        },
      ],
      exports: ['EVENT_BUS', EventBusService],
    };
  }
}