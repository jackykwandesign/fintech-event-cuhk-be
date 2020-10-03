import { UserRole } from "../user-role.enum";

export class UserDto {
    name: string;
    uid: string;
    role: UserRole;
}