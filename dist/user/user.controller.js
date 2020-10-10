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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const User_dto_1 = require("../auth/dto/User.dto");
const get_user_decorator_1 = require("../auth/get-user.decorator");
const roles_decorator_1 = require("../auth/roles.decorator");
const roles_guard_1 = require("../auth/roles.guard");
const user_role_enum_1 = require("../auth/user-role.enum");
const userOptDto_dto_1 = require("./dto/userOptDto.dto");
const user_service_1 = require("./user.service");
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    getAllParticipant() {
        return this.userService.getAllParticipant();
    }
    getShareParticipant() {
        return this.userService.getShareParticipant();
    }
    getAllHelperOrAdmin() {
        return this.userService.getAllHelperOrAdmin();
    }
    setHelper(userOptDto) {
        return this.userService.setHelper(userOptDto);
    }
    createHelper(userOptDto) {
        return this.userService.createHelper(userOptDto);
    }
};
__decorate([
    common_1.Get("/participant"),
    roles_decorator_1.Roles(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.HELPER),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UserController.prototype, "getAllParticipant", null);
__decorate([
    common_1.Get("/shareParticipant"),
    roles_decorator_1.Roles(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.HELPER),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UserController.prototype, "getShareParticipant", null);
__decorate([
    common_1.Get("/helperOrAdmin"),
    roles_decorator_1.Roles(user_role_enum_1.UserRole.ADMIN),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UserController.prototype, "getAllHelperOrAdmin", null);
__decorate([
    common_1.Put("/setHelper"),
    roles_decorator_1.Roles(user_role_enum_1.UserRole.ADMIN),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [userOptDto_dto_1.UserOptDto]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "setHelper", null);
__decorate([
    common_1.Post("/createHelper"),
    roles_decorator_1.Roles(user_role_enum_1.UserRole.ADMIN),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [userOptDto_dto_1.UserOptDto]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "createHelper", null);
UserController = __decorate([
    common_1.Controller('user'),
    common_1.UseGuards(passport_1.AuthGuard('bearer'), roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map