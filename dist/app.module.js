"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const auth_module_1 = require("./auth/auth.module");
const nestjs_firebase_admin_1 = require("@aginix/nestjs-firebase-admin");
const admin = require("firebase-admin");
const user_module_1 = require("./user/user.module");
const webinar_module_1 = require("./webinar/webinar.module");
require('dotenv').config();
const config = require("config");
const firebaseConfig = config.get('firebase');
let serviceAccount = {
    projectId: process.env.NODE_ENV === "production" ? process.env.FIREBASE_PROJECT_ID : firebaseConfig.project_id,
    privateKey: process.env.NODE_ENV === "production" ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : firebaseConfig.private_key.replace(/\\n/g, '\n'),
    clientEmail: process.env.NODE_ENV === "production" ? process.env.FIREBASE_CLIENT_EMAIL : firebaseConfig.client_email,
};
let AppModule = class AppModule {
};
AppModule = __decorate([
    common_1.Module({
        imports: [
            auth_module_1.AuthModule,
            nestjs_firebase_admin_1.FirebaseAdminModule.forRootAsync({
                useFactory: () => ({
                    credential: admin.credential.cert(serviceAccount)
                })
            }),
            user_module_1.UserModule,
            webinar_module_1.WebinarModule,
        ],
        controllers: [],
        providers: [],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map