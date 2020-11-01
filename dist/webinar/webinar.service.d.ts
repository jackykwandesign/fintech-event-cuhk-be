import { FirebaseFirestoreService } from '@aginix/nestjs-firebase-admin';
import { UpdateWebinarDto } from './dto/update-webinar.dto';
export declare class WebinarService {
    private fireStore;
    constructor(fireStore: FirebaseFirestoreService);
    getAllWebinar(): Promise<any[]>;
    findWebinar(id: string): Promise<FirebaseFirestore.DocumentData>;
    updateWebinarByID(updateWebinarDto: UpdateWebinarDto): Promise<void>;
}
