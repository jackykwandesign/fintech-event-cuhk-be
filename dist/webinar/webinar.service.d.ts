import { FirebaseFirestoreService } from '@aginix/nestjs-firebase-admin';
export declare class WebinarService {
    private fireStore;
    constructor(fireStore: FirebaseFirestoreService);
    getAllWebinar(): Promise<FirebaseFirestore.DocumentData[]>;
}
