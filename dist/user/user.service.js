"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const nestjs_firebase_admin_1 = require("@aginix/nestjs-firebase-admin");
const common_1 = require("@nestjs/common");
const User_dto_1 = require("../auth/dto/User.dto");
const user_role_enum_1 = require("../auth/user-role.enum");
let UserService = class UserService {
    constructor(firebaseAuth, fireStore) {
        this.firebaseAuth = firebaseAuth;
        this.fireStore = fireStore;
    }
    async getAllParticipant() {
        const snapshot = await this.fireStore.collection('User').where('role', '==', user_role_enum_1.UserRole.USER).get();
        const data = snapshot.docs.map(doc => doc.data());
        return data;
    }
    async getShareParticipant() {
        const snapshot = await this.fireStore.collection('User').where('role', '==', user_role_enum_1.UserRole.USER).where('kycData.agreementOfShow', '==', true).get();
        const data = snapshot.docs.map(doc => doc.data());
        return data;
    }
    async getAllHelperOrAdmin() {
        const snapshot = await this.fireStore.collection('User').where('role', 'in', [user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.HELPER]).get();
        const data = snapshot.docs.map(doc => doc.data());
        return data;
    }
    async setHelper(userOptDto) {
        const users = await this.fireStore.collection('User').where('email', '==', userOptDto.email).get();
        const userDocID = await users.docs[0].id;
        try {
            const res = await this.fireStore.collection('User').doc(userDocID).update({
                role: user_role_enum_1.UserRole.HELPER
            });
            console.log("Document successfully updated!", res);
        }
        catch (error) {
            console.error("Error updating document: ", error);
            throw new common_1.BadRequestException();
        }
    }
    async createHelper(userOptDto) {
        const users = await this.fireStore.collection('User').where('email', '==', userOptDto.email).get();
        if (users.docs.length === 0) {
            try {
                const userRecord = await this.firebaseAuth.createUser({
                    email: userOptDto.email,
                    emailVerified: false,
                    displayName: 'Helper',
                    disabled: false
                });
                let newUser = {
                    name: "Helper",
                    uid: userRecord.uid,
                    photoURL: "",
                    role: user_role_enum_1.UserRole.HELPER,
                    finishInfo: false,
                    email: userRecord.email
                };
                await this.fireStore.collection('User').add(newUser);
            }
            catch (error) {
                console.log('Error creating new user:', error);
                throw new common_1.BadRequestException();
            }
        }
        else {
            const userDocID = await users.docs[0].id;
            try {
                const res = await this.fireStore.collection('User').doc(userDocID).update({
                    role: user_role_enum_1.UserRole.HELPER
                });
                console.log("Document successfully updated!", res);
            }
            catch (error) {
                console.error("Error updating document: ", error);
                throw new common_1.BadRequestException();
            }
        }
    }
};
UserService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [nestjs_firebase_admin_1.FirebaseAuthenticationService,
        nestjs_firebase_admin_1.FirebaseFirestoreService])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map