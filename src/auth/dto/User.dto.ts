import { UserRole } from "../user-role.enum";

export class UserDto {
    name: string;
    uid: string;
    role: UserRole;
    photoURL: string;
    finishInfo: boolean;
    email: string;
}