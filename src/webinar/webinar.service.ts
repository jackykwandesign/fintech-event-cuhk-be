import { FirebaseAuthenticationService, FirebaseFirestoreService } from '@aginix/nestjs-firebase-admin';
import { Injectable } from '@nestjs/common';

@Injectable()
export class WebinarService {
    constructor(
        private firebaseAuth: FirebaseAuthenticationService,
        private fireStore: FirebaseFirestoreService
    ){}

    async getAllWebinar(){
        const snapshot = await this.fireStore.collection('Webinar').get()
        const data = snapshot.docs.map(doc => doc.data());
        return data
    }
}
