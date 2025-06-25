import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UploadService } from './upload/upload.service';
import { UploadModule } from './upload/upload.module';
import { MailSenderService } from './mail_sender/mail_sender.service';
import { MailSenderModule } from './mail_sender/mail_sender.module';

@Module({
  imports: [UserModule,
    TypeOrmModule.forRoot({
    type: 'mssql',
    host: 'localhost',
    port: 1433,
    username: 'sa',
    password: '123456',
    database: 'DB-User-management',
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: true,
    options: {
      encrypt: false,
    },
  }),
    AuthModule,
    UploadModule,
    MailSenderModule,
  ],
  controllers: [AppController],
  providers: [AppService, UploadService, MailSenderService],
})
export class AppModule {}
