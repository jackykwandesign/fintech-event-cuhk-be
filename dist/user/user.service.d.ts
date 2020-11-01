import { FirebaseAuthenticationService, FirebaseFirestoreService } from '@aginix/nestjs-firebase-admin';
import { UserDto } from 'src/auth/dto/User.dto';
import { UserRole } from 'src/auth/user-role.enum';
import { UserOptDto } from './dto/userOptDto.dto';
interface KYCData {
    salutation: string;
    knowOfConference: string;
    supportOrganization?: string;
    advertisement?: string;
    otherKnowOfConference?: string;
    otherInterest?: string;
    interestCheckbox: string[];
    agreementOfCollection: boolean;
    agreementOfShow: boolean;
    agreementOfReceiveInformation: boolean;
    firstName: string;
    lastName: string;
    contactEmail: string;
    jobTitle: string;
    organization: string;
    contactNumber: string;
    areaCode: string;
}
interface UserDoc {
    name: string;
    uid: string;
    photoURL: string;
    role: UserRole.USER;
    finishInfo: boolean;
    email: string;
    kycData: KYCData;
    loginTime: number;
    lastLoginAt: Date;
}
export declare class UserService {
    private firebaseAuth;
    private fireStore;
    constructor(firebaseAuth: FirebaseAuthenticationService, fireStore: FirebaseFirestoreService);
    getAllParticipant(): Promise<FirebaseFirestore.DocumentData[]>;
    getShareParticipant(): Promise<FirebaseFirestore.DocumentData[]>;
    getUserByEmail(email: string): Promise<FirebaseFirestore.DocumentData>;
    getUserDocIDByEmail(email: string): Promise<string>;
    getUserDocByEmail(email: string): Promise<UserDoc>;
    getAllHelperOrAdmin(): Promise<FirebaseFirestore.DocumentData[]>;
    setHelper(userOptDto: UserOptDto): Promise<void>;
    createHelper(userOptDto: UserOptDto): Promise<void>;
    deleteFirebaseUserAndUserDataByEmail(email: string): Promise<void>;
    processUserDoc(data: any): {
        name: any;
        uid: string;
        photoURL: string;
        role: UserRole;
        finishInfo: boolean;
        email: any;
        kycData: KYCData;
    };
    sendInternalMessage(sender: UserDto, receiverEmail: string, message: string): Promise<void>;
    updateLoginTime(userOptDto: UserDto): Promise<void>;
    createFirebaseUser(): Promise<void>;
}
export {};
