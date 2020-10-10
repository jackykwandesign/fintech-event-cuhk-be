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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const nestjs_firebase_admin_1 = require("@aginix/nestjs-firebase-admin");
const user_role_enum_1 = require("./user-role.enum");
let AuthService = class AuthService {
    constructor(firebaseAuth, fireStore) {
        this.firebaseAuth = firebaseAuth;
        this.fireStore = fireStore;
    }
    async fillUserInfo(formData, user) {
        console.log("formData", formData);
        const users = await this.fireStore.collection('User').where('uid', '==', user.uid).get();
        const userDocID = await users.docs[0].id;
        try {
            const res = await this.fireStore.collection('User').doc(userDocID).update({
                kycData: formData,
                finishInfo: true,
                name: formData.firstName + " " + formData.lastName
            });
        }
        catch (error) {
            console.error("Error updating document: ", error);
            throw new common_1.BadRequestException();
        }
    }
    async login(user) {
        delete user.uid;
        return user;
    }
    async register(req) {
        const { authorization } = req.headers;
        if (!authorization)
            throw new common_1.UnauthorizedException();
        if (!authorization.startsWith('Bearer'))
            throw new common_1.UnauthorizedException();
        const split = authorization.split('Bearer ');
        if (split.length !== 2)
            throw new common_1.UnauthorizedException();
        const token = split[1];
        const found = await this.validateUser(token);
        if (found) {
            throw new common_1.BadRequestException('already registered');
        }
        try {
            const firebaseUser = await this.firebaseAuth.auth.verifyIdToken(token);
            const userData = await this.firebaseAuth.auth.getUser(firebaseUser.uid);
            let newUser = {
                name: userData.displayName ? userData.displayName : "",
                uid: userData.uid,
                photoURL: userData.photoURL ? userData.photoURL : "",
                role: user_role_enum_1.UserRole.USER,
                finishInfo: false,
                email: userData.email
            };
            await this.fireStore.collection('User').add(newUser);
            return;
        }
        catch (error) {
            console.error("error", error);
            throw new common_1.NotFoundException();
        }
    }
    async validateUser(token) {
        try {
            const firebaseUser = await this.firebaseAuth.auth.verifyIdToken(token);
            const users = await this.fireStore.collection('User').where('uid', '==', firebaseUser.uid).get();
            const data = await users.docs.map(doc => doc.data());
            if (data && data.length >= 1) {
                return data[0];
            }
            return false;
        }
        catch (error) {
            console.error(error);
            throw new common_1.UnauthorizedException();
        }
    }
};
AuthService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [nestjs_firebase_admin_1.FirebaseAuthenticationService,
        nestjs_firebase_admin_1.FirebaseFirestoreService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map