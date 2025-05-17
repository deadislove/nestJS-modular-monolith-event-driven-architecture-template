import { EmailProvider } from './email.provider.interface';

export class ConsoleEmailProvider implements EmailProvider {
  async sendEmail(to: string, subject: string, body: string): Promise<void> {
    console.log(`[DEV EMAIL] To: ${to}, Subject: ${subject}, Body: ${body}`);
  }
}
