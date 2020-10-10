import { FirebaseAuthenticationService, FirebaseFirestoreService } from '@aginix/nestjs-firebase-admin';
import { UserOptDto } from './dto/userOptDto.dto';
export declare class UserService {
    private firebaseAuth;
    private fireStore;
    constructor(firebaseAuth: FirebaseAuthenticationService, fireStore: FirebaseFirestoreService);
    getAllParticipant(): Promise<FirebaseFirestore.DocumentData[]>;
    getShareParticipant(): Promise<FirebaseFirestore.DocumentData[]>;
    getAllHelperOrAdmin(): Promise<FirebaseFirestore.DocumentData[]>;
    setHelper(userOptDto: UserOptDto): Promise<void>;
    createHelper(userOptDto: UserOptDto): Promise<void>;
}
