import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailService: MailerService) {}

  public mail(to: string, subject: string, text: string, html: string): void {

    this.mailService
      .sendMail({
        to: to,
        subject: subject,
        text: text,
        html: html,
      })
      .then(() => {})
      .catch(() => {});
  }
}