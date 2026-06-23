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
const prisma_service_1 = require("./prisma.service");
const api_service_1 = require("./api.service");
const api_controller_1 = require("./api.controller");
const download_controller_1 = require("./download.controller");
const auth_service_1 = require("./auth.service");
const auth_guard_1 = require("./auth.guard");
const roles_guard_1 = require("./roles.guard");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [],
        controllers: [api_controller_1.ApiController, download_controller_1.DownloadController],
        providers: [prisma_service_1.PrismaService, api_service_1.ApiService, auth_service_1.AuthService, auth_guard_1.AuthGuard, roles_guard_1.RolesGuard],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map