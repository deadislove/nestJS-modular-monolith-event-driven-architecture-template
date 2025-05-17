import { EventBus, Event } from '../event-bus.interface';
import { Kafka, EachMessagePayload } from 'kafkajs';

export class KafkaEventBus implements EventBus {
  private kafka = new Kafka({ brokers: ['localhost:9092'] });
  private producer = this.kafka.producer();
  private consumer = this.kafka.consumer({ groupId: 'event-bus-group' });
  private handlers = new Map<string, ((event: Event) => void)[]>();

  constructor(kafkaUrl: string) {
  	this.kafka = new Kafka({ brokers: [kafkaUrl] });
  	this.producer = this.kafka.producer();
  	this.consumer = this.kafka.consumer({ groupId: 'event-bus-group' });
  	this.connect();
  }

  private async connect() {
    await this.producer.connect();
    await this.consumer.connect();
    await this.consumer.run({
      eachMessage: async ({ topic, message }: EachMessagePayload) => {
        const parsed = JSON.parse(message.value!.toString());
        const handlers = this.handlers.get(topic) || [];
        handlers.forEach(handler => handler(parsed));
      }
    });
  }

  async publish<T extends Event>(event: T): Promise<void> {
    await this.producer.send({
      topic: event.type,
      messages: [{ value: JSON.stringify(event) }],
    });
  }

  subscribe<T extends Event>(eventType: new (...args: any[]) => T, handler: (event: T) => void): void {
    const key = new eventType().type;
    if (!this.handlers.has(key)) {
      this.handlers.set(key, []);
      this.consumer.subscribe({ topic: key, fromBeginning: true });
    }
    this.handlers.get(key)!.push(handler);
  }
}