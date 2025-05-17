import { EmailProvider } from './email/email.provider.interface';
import { ConsoleEmailProvider } from './email/console-email.provider';

export class ProviderFactory {
  static createEmailProvider(): EmailProvider {

    return new ConsoleEmailProvider();
  }
}
