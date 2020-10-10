import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as config from 'config'
import { Logger, ValidationPipe } from '@nestjs/common';
import { Request } from 'express';
const serverConfig = config.get('server')

async function bootstrap() {
  const logger = new Logger("bootstrap")
  const app = await NestFactory.create(AppModule);
  


  // app.use((req: Request,res,next)=>{
  //   console.log("middle")
  //   req.headers.
  //   next();
  // })
  app.useGlobalPipes(
    new ValidationPipe({
      // disableErrorMessages: true,
    }),
  );


  let port = process.env.PORT || serverConfig.port
  logger.log(`Server running in port ${port}`)
  await app.listen(port);
}
bootstrap();
