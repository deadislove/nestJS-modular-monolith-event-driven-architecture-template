import { EventBus, Event } from '../event-bus.interface';

export class InMemoryEventBus implements EventBus {
  private handlers: Map<string, ((event: Event) => void)[]> = new Map();

  async publish<T extends Event>(event: T): Promise<void> {
    const eventHandlers = this.handlers.get(event.type) || [];
    for (const handler of eventHandlers) {
      await handler(event);
    }
  }

  subscribe<T extends Event>(eventType: new (...args: any[]) => T, handler: (event: T) => void): void {
    const key = new eventType().type;
    if (!this.handlers.has(key)) {
      this.handlers.set(key, []);
    }
    this.handlers.get(key)!.push(handler);
  }
}