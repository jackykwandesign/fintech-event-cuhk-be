import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { FirebaseAdminModule } from '@aginix/nestjs-firebase-admin'
import * as admin from 'firebase-admin'
import { ServiceAccount} from 'firebase-admin'
import { UserModule } from './user/user.module';
import { WebinarModule } from './webinar/webinar.module';
require('dotenv').config();
import * as config from 'config'
const firebaseConfig = config.get('firebase')

let serviceAccount: ServiceAccount = {
  projectId: process.env.NODE_ENV === "production" ? process.env.FIREBASE_PROJECT_ID : firebaseConfig.project_id,
  privateKey: process.env.NODE_ENV === "production" ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : firebaseConfig.private_key.replace(/\\n/g, '\n'),
  clientEmail: process.env.NODE_ENV === "production" ? process.env.FIREBASE_CLIENT_EMAIL : firebaseConfig.client_email,
}

@Module({
  imports: [
    AuthModule,
    FirebaseAdminModule.forRootAsync({
      useFactory: () => ({
        credential: admin.credential.cert(serviceAccount)
      })
    }),
    UserModule,
    WebinarModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
