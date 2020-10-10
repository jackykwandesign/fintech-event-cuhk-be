import { FirebaseAuthenticationService, FirebaseFirestoreService } from '@aginix/nestjs-firebase-admin';
import { Request } from 'express';
import { UserDto } from './dto/User.dto';
export declare class AuthService {
    private firebaseAuth;
    private fireStore;
    constructor(firebaseAuth: FirebaseAuthenticationService, fireStore: FirebaseFirestoreService);
    fillUserInfo(formData: any, user: UserDto): Promise<void>;
    login(user: UserDto): Promise<UserDto>;
    register(req: Request): Promise<void>;
    validateUser(token: string): Promise<false | FirebaseFirestore.DocumentData>;
}
