export interface Event {
  type: string;
}

export interface EventBus {
  publish<T extends Event>(event: T): Promise<void>;
  subscribe<T extends Event>(eventType: new (...args: any[]) => T, handler: (event: T) => Promise<void> | void): void;
}