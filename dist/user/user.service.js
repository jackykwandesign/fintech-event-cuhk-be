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
const nodemailer = require("nodemailer");
const User_dto_1 = require("../auth/dto/User.dto");
const user_role_enum_1 = require("../auth/user-role.enum");
require('dotenv').config();
const config = require("config");
const smtpConfig = config.get('smtp');
let smtpAccount = {
    host: "smtp.cintec.cuhk.edu.hk",
    port: 25,
    email: "finteconf@cintec.cuhk.edu.hk",
    password: "cin@1358",
};
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
    async getUserByEmail(email) {
        const snapshot = await this.fireStore.collection('User').where('email', '==', email).get();
        if (snapshot.docs.length === 0) {
            throw new common_1.NotFoundException();
        }
        else {
            return snapshot.docs[0].data();
        }
    }
    async getUserDocIDByEmail(email) {
        const snapshot = await this.fireStore.collection('User').where('email', '==', email).get();
        if (snapshot.docs.length === 0) {
            throw new common_1.NotFoundException();
        }
        else {
            return snapshot.docs[0].id;
        }
    }
    async getUserDocByEmail(email) {
        const snapshot = await this.fireStore.collection('User').where('email', '==', email).get();
        if (snapshot.docs.length === 0) {
            throw new common_1.NotFoundException();
        }
        else {
            return snapshot.docs[0].data();
        }
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
    async deleteFirebaseUserAndUserDataByEmail(email) {
        try {
            const user = await this.firebaseAuth.getUserByEmail('tszkitkwan88884@gmail.com');
            await this.firebaseAuth.deleteUser(user.uid);
            try {
                const userDocID = await this.getUserDocIDByEmail('tszkitkwan88884@gmail.com');
                await this.fireStore.collection('User').doc(userDocID).delete();
            }
            catch (error) {
                console.log("error", error);
            }
        }
        catch (error) {
            console.log("error", error);
            throw new common_1.BadRequestException();
        }
    }
    processUserDoc(data) {
        let KYCDataDoc = {
            salutation: data.salutation ? data.salutation : "",
            firstName: data.firstName ? data.firstName : "",
            lastName: data.lastName ? data.lastName : "",
            organization: data.organization ? data.organization : "",
            jobTitle: data.jobTitle ? data.jobTitle : "",
            contactEmail: data.contactEmail ? data.contactEmail : "",
            contactNumber: data.contactNumber ? data.contactNumber : "",
            areaCode: data.areaCode ? data.areaCode : "",
            knowOfConference: data.knowOfConference ? data.knowOfConference : "",
            supportOrganization: "unknown",
            advertisement: "unknown",
            otherKnowOfConference: "unknown",
            interestCheckbox: [],
            otherInterest: "",
            agreementOfCollection: true,
            agreementOfShow: false,
            agreementOfReceiveInformation: true,
        };
        if (KYCDataDoc.knowOfConference === "") {
            KYCDataDoc.knowOfConference = "Others";
            KYCDataDoc.otherKnowOfConference = "unknown";
        }
        data.interest1 && KYCDataDoc.interestCheckbox.push("AI & Machine Learning");
        data.interest2 && KYCDataDoc.interestCheckbox.push("Big Data Analytics");
        data.interest3 && KYCDataDoc.interestCheckbox.push("Cybersecurity");
        data.interest4 && KYCDataDoc.interestCheckbox.push("STO/Tokenization/Virtual Assets");
        data.interest5 && KYCDataDoc.interestCheckbox.push("FinTech in the Banking/Virtual Banking");
        if (KYCDataDoc.interestCheckbox.length === 0) {
            KYCDataDoc.interestCheckbox = ["AI & Machine Learning", "Big Data Analytics", "Cybersecurity", "STO/Tokenization/Virtual Assets", "FinTech in the Banking/Virtual Banking"];
        }
        let newUserDoc = {
            name: data.name,
            uid: "test 1234",
            photoURL: "",
            role: user_role_enum_1.UserRole.USER,
            finishInfo: true,
            email: data.email,
            kycData: KYCDataDoc
        };
        return newUserDoc;
    }
    async sendInternalMessage(sender, receiverEmail, message) {
        let transporter = nodemailer.createTransport({
            host: smtpAccount.host,
            port: smtpAccount.port,
            secure: false,
            auth: {
                user: smtpAccount.email,
                pass: smtpAccount.password,
            },
        });
        let senderDoc = await this.getUserDocByEmail(sender.email);
        console.log("senderDoc", senderDoc.kycData);
        let newMessage = `You have got an message from conference participant ${sender.name} (${sender.email}), ${senderDoc.kycData.jobTitle}@${senderDoc.kycData.organization}. Message: ${message}`;
        let newMessageHTML = "" +
            `<p>Hello ${sender.name}, </p>` +
            '<br/>' +
            `<p>You have got an message from conference participant ${sender.name} ( ${sender.email} )</p>` +
            `<p>Message: ${message} </p>` +
            '<br/>' +
            '<p>If you are not in this conference, you can ignore this email.</p>' +
            '<br/>' +
            '<p>Thanks, </p>' +
            '<p>Your 2020 CUHK FinTech Conference team</p>';
        let info = await transporter.sendMail({
            from: `noreply@cintec.cuhk.edu.hk`,
            to: receiverEmail,
            subject: `Message from 2020 Fintech Conference participant ${sender.name}`,
            text: newMessage,
            html: newMessageHTML,
        });
        await this.fireStore.collection('Message').add({
            senderEmail: sender.email,
            senderName: sender.name,
            receiverEmail: sender.email,
            message: message,
            timestamp: new Date()
        });
        console.log("Message sent: %s", info.messageId);
    }
    async updateLoginTime(userOptDto) {
        console.log("userOptDto", userOptDto);
        const users = await this.fireStore.collection('User').where('email', '==', userOptDto.email).get();
        const userDocID = await users.docs[0].id;
        const lastLoginTime = await users.docs[0].data().loginTime;
        try {
            const res = await this.fireStore.collection('User').doc(userDocID).update({
                loginTime: lastLoginTime ? lastLoginTime + 10 : 10,
                lastLoginAt: new Date().toISOString()
            });
            console.log("Document successfully updated!", res);
        }
        catch (error) {
            console.error("Error updating document: ", error);
            throw new common_1.BadRequestException();
        }
    }
    async createFirebaseUser() {
    }
};
UserService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [nestjs_firebase_admin_1.FirebaseAuthenticationService,
        nestjs_firebase_admin_1.FirebaseFirestoreService])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map