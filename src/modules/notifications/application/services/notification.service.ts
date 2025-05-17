import { LoggerService } from "@infra/logger/logger.service";
import { EmailProvider } from "@modules/notifications/infra/providers/email/email.provider.interface";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class NotificationService {
    constructor(
        @Inject('EMAIL_PROVIDER')
        private readonly emailProvider: EmailProvider,
        private readonly logger: LoggerService
    ) { }

    async sendEmailForRegister(userEmail: string) {
        const subject = 'Welcome!';
        const body = '<h1>Thank you for joining</h1>';
        this.logger.log(`Email info: To: ${userEmail}; Subject: ${subject}; Body: ${body}`)
        await this.emailProvider.sendEmail(userEmail, subject, body);
    }
}