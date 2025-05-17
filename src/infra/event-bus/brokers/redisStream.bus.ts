import { EventBus } from '../event-bus.interface';
import Redis from 'ioredis';
import { Event } from '../event-bus.interface';

export class RedisStreamEventBus implements EventBus {
    private redis: Redis;

    constructor(redisUrl: string) {
        this.redis = new Redis(redisUrl);
    }

    async publish<T extends Event>(event: T): Promise<void> {
        const streamKey = event.constructor.name;
        const data = JSON.stringify(event);
        await this.redis.xadd(streamKey, '*', 'data', data);
    }

    async subscribe<T extends Event>(
        eventType: new (...args: any[]) => T,
        handler: (event: T) => void | Promise<void>,
        group = 'default-group',
        consumer = 'consumer-1'
    ): Promise<void> {
        const streamKey = eventType.name;

        try {
            await this.redis.xgroup('CREATE', streamKey, group, '$', 'MKSTREAM');
        } catch (err: any) {
            if (!err.message.includes('BUSYGROUP')) throw err;
        }

        const loop = async () => {
            while (true) {

                const res = await xreadgroupWithBlock(this.redis, group, consumer, streamKey);

                if (!res) continue;

                for (const [stream, messages] of res) {
                    for (const [id, fields] of messages) {
                        const dataIndex = fields.findIndex((f, i) => f === 'data' && typeof fields[i + 1] === 'string');
                        const jsonString = dataIndex >= 0 ? fields[dataIndex + 1] : '{}';
                        const payload = JSON.parse(jsonString);
                        const eventInstance = Object.assign(new eventType(), payload);

                        await handler(eventInstance);
                        await this.redis.xack(streamKey, group, id);
                    }
                }
            }
        };

        loop();
    }

}

async function xreadgroupWithBlock(
    redis: Redis,
    group: string,
    consumer: string,
    streamKey: string
): Promise<[string, [string, string[]][]][] | null> {
    const res = await (redis as any).xreadgroup(
        'GROUP', group, consumer,
        'BLOCK', 5000,
        'COUNT', 10,
        'STREAMS', streamKey, '>'
    );
    return res;
}