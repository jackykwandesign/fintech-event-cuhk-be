import { UserRole } from "../user-role.enum";
export declare class UserDto {
    name: string;
    uid: string;
    role: UserRole;
    photoURL: string;
    finishInfo: boolean;
    email: string;
}
