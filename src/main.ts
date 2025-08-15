import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
   app.enableCors({
    origin: "*",
    credentials: true,
    allowedHeaders: ["Accept","Authorization","Content-Type","X-Requested-With","apollo-require-preflight"],
    methods: ["GET","PUT","POST","DELETE","OPTIONS"]
  })

    app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    exceptionFactory: (error) => {
      const formatedError = error.reduce((acc,_error) => {
        acc[_error.property] = Object.values(_error.constraints!).join(", ",)
        return acc
      },{})
      throw new BadRequestException(formatedError)
     }
  }))

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
