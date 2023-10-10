import { Inject, Injectable } from '@nestjs/common';
import { MAIL_OPTIONS_TOKEN } from './mail.constants';
import { NodeMailerOptions } from './options.interface';
// import { Transporter } from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const nodemailer = require('nodemailer');

@Injectable()
export class NodeMailerService {
  private transporter: any;
  constructor(@Inject(MAIL_OPTIONS_TOKEN) options: NodeMailerOptions) {
    this.transporter = nodemailer.createTransport({
      // host: options.host,
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: options.transport.auth.user,
        clientId: options.transport.auth.clientId,
        clientSecret: options.transport.auth.clientSecret,
        refreshToken: options.transport.auth.refresh_token,
      },
    });
  }

  async send(mailOptions: Mail.Options) {
    await this.transporter?.sendMail(mailOptions);
  }
}
