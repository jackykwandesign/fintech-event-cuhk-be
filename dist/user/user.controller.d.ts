import { UserOptDto } from './dto/userOptDto.dto';
import { UserService } from './user.service';
export declare class UserController {
    private userService;
    constructor(userService: UserService);
    getAllParticipant(): Promise<FirebaseFirestore.DocumentData[]>;
    getShareParticipant(): Promise<FirebaseFirestore.DocumentData[]>;
    getAllHelperOrAdmin(): Promise<FirebaseFirestore.DocumentData[]>;
    setHelper(userOptDto: UserOptDto): Promise<void>;
    createHelper(userOptDto: UserOptDto): Promise<void>;
}
