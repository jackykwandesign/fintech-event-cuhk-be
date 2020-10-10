import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { WebinarController } from './webinar.controller';
import { WebinarService } from './webinar.service';

@Module({
  imports:[
    AuthModule
  ],
  controllers: [WebinarController],
  providers: [WebinarService]
})
export class WebinarModule {}
