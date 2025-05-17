import { BaseEvent } from "@infra/event-bus/event";

export class UserCreatedEvent extends BaseEvent {
    type: string = 'account.created'

    constructor(public readonly accountId: string, public readonly email:string) {
        super()
    }
}