import { Module } from "@nestjs/common";
import { UserCreatedHandler } from "./application/handlers/user-created.handler";
import { EventBusModule } from "@infra/event-bus/event-bus.module";
import { ProviderFactory } from "./infra/providers/provider.factory";
import { NotificationService } from "./application/services/notification.service";
import { NotificationFacade } from "./application/facades/notification.facade.service";

@Module({
    imports: [
        EventBusModule
    ],
    providers: [
        UserCreatedHandler,
        {
            provide: 'EMAIL_PROVIDER',
            useFactory: () => ProviderFactory.createEmailProvider(),
        },
        NotificationService,
        NotificationFacade,
    ],
    exports: [
        'EMAIL_PROVIDER', 
        NotificationService,
        NotificationFacade
    ]
})
export class NotificationModule { }