import { Module } from '@nestjs/common';
import { MailSenderController } from './mail_sender.controller';
import { MailSenderService } from './mail_sender.service';

@Module({
  controllers: [MailSenderController],
  providers: [MailSenderService],
  exports: [MailSenderService],
})
export class MailSenderModule {}
