import { Injectable } from "@nestjs/common";
import { NotificationService } from "../services/notification.service";

@Injectable()
export class NotificationFacade {
    constructor(
        private readonly notificationService: NotificationService
    ) {}
}