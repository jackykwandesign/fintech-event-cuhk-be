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
exports.WebinarService = void 0;
const nestjs_firebase_admin_1 = require("@aginix/nestjs-firebase-admin");
const common_1 = require("@nestjs/common");
let WebinarService = class WebinarService {
    constructor(fireStore) {
        this.fireStore = fireStore;
    }
    async getAllWebinar() {
        const snapshot = await this.fireStore.collection('Webinar').get();
        const data = snapshot.docs.map(doc => doc.data());
        return data;
    }
};
WebinarService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [nestjs_firebase_admin_1.FirebaseFirestoreService])
], WebinarService);
exports.WebinarService = WebinarService;
//# sourceMappingURL=webinar.service.js.map