import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //Kích hoạt validation toàn cục
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // loại bỏ các thuộc tính không được định nghĩa trong DTO
    forbidNonWhitelisted: true, // trả về lỗi nếu có thuộc tính không được định nghĩa trong DTO
    transform: true, // tự động chuyển đổi kiểu dữ liệu
  }));

  const config = new DocumentBuilder()
    .setTitle('My API')// tiêu đề của API
    .setDescription('API description')// mô tả của API
    .setVersion('1.0')// phiên bản của API
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);


  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
