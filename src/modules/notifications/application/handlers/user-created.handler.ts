import { EventHandler } from "@infra/event-bus/handler.decorator";
import { UserCreatedEvent } from "@modules/user/application/events/account-created.event";
import { NotificationService } from "../services/notification.service";
import { LoggerService } from "@infra/logger/logger.service";

@EventHandler(UserCreatedEvent)
export class UserCreatedHandler {
    constructor(
        private readonly notificationService: NotificationService,
        private readonly logger: LoggerService
    ) {}

    async handle(event: UserCreatedEvent) {        
        this.logger.log(`Register User: ${event.email}`)
        this.notificationService.sendEmailForRegister(event.email)
    }
}