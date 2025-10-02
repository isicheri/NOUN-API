import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import { EmailMessageBody } from './types/email.interface';

@Injectable()
export class EmailService {
  private resend: Resend;
  constructor(private configService: ConfigService) {
    this.resend = new Resend(this.configService.get<string>('RESEND_API_KEY'));
  }
  async sendMail(
    { to, from }: Partial<EmailMessageBody>,
    body: string,
    subject: string,
  ) {
    const mail = await this.resend.emails.send({
      from: from as unknown as string,
      to: [to as unknown as string],
      subject: subject,
      html: body,
    });
    if (mail.error) {
      console.error('📨 Email send failed:', mail.error); // 👈 Add this
      return {
        message: mail.error?.message || 'Unknown error',
        success: false,
      };
    }
    return {
      message: `Email succesfully sent to ${to}.`,
      success: true,
    };
  }
}
