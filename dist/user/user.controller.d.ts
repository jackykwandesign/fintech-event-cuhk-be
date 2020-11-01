import { UserDto } from 'src/auth/dto/User.dto';
import { MessageDto } from './dto/messageDto.dto';
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
    sendInternalMessage(user: UserDto, messageDto: MessageDto): Promise<void>;
    updateLoginTime(user: UserDto): Promise<void>;
    getUserByEmail(email: string): Promise<FirebaseFirestore.DocumentData>;
}
