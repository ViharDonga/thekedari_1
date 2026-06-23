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
exports.ApiController = void 0;
const common_1 = require("@nestjs/common");
const api_service_1 = require("./api.service");
let ApiController = class ApiController {
    constructor(apiService) {
        this.apiService = apiService;
    }
    getSites() {
        return this.apiService.getSites();
    }
    getWorkers() {
        return this.apiService.getWorkers();
    }
    getMaterials() {
        return this.apiService.getMaterials();
    }
    getDeliveries() {
        return this.apiService.getDeliveries();
    }
    getTransactions() {
        return this.apiService.getTransactions();
    }
    getAttendanceRecords() {
        return this.apiService.getAttendanceRecords();
    }
    getRentals() {
        return this.apiService.getRentals();
    }
    getBookings() {
        return this.apiService.getBookings();
    }
    addWorker(body) {
        return this.apiService.addWorker(body);
    }
    updateWorkerAttendance(body) {
        return this.apiService.updateWorkerAttendance(body.workerId, body.status, body.overtimeHours, body.date);
    }
    payWorker(body) {
        return this.apiService.payWorker(body.workerId, body.amount, body.paymentMode, body.type);
    }
    deleteAdvanceTransaction(id) {
        return this.apiService.deleteAdvanceTransaction(id);
    }
    addRentalMaterial(body) {
        return this.apiService.addRentalMaterial(body);
    }
    returnRentalMaterial(id, body) {
        return this.apiService.returnRentalMaterial(id, body.endDate);
    }
    deleteRentalMaterial(id) {
        return this.apiService.deleteRentalMaterial(id);
    }
    receiveMaterial(body) {
        return this.apiService.receiveMaterial(body.siteId, body.materialName, body.supplierName, body.quantity, body.unit, body.ratePerUnit);
    }
    addLabourBooking(body) {
        return this.apiService.addLabourBooking(body);
    }
    cancelLabourBooking(id) {
        return this.apiService.cancelLabourBooking(id);
    }
};
exports.ApiController = ApiController;
__decorate([
    (0, common_1.Get)('sites'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ApiController.prototype, "getSites", null);
__decorate([
    (0, common_1.Get)('workers'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ApiController.prototype, "getWorkers", null);
__decorate([
    (0, common_1.Get)('materials'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ApiController.prototype, "getMaterials", null);
__decorate([
    (0, common_1.Get)('deliveries'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ApiController.prototype, "getDeliveries", null);
__decorate([
    (0, common_1.Get)('transactions'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ApiController.prototype, "getTransactions", null);
__decorate([
    (0, common_1.Get)('attendance'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ApiController.prototype, "getAttendanceRecords", null);
__decorate([
    (0, common_1.Get)('rentals'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ApiController.prototype, "getRentals", null);
__decorate([
    (0, common_1.Get)('bookings'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ApiController.prototype, "getBookings", null);
__decorate([
    (0, common_1.Post)('workers'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ApiController.prototype, "addWorker", null);
__decorate([
    (0, common_1.Patch)('attendance'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ApiController.prototype, "updateWorkerAttendance", null);
__decorate([
    (0, common_1.Post)('payments'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ApiController.prototype, "payWorker", null);
__decorate([
    (0, common_1.Delete)('transactions/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ApiController.prototype, "deleteAdvanceTransaction", null);
__decorate([
    (0, common_1.Post)('rentals'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ApiController.prototype, "addRentalMaterial", null);
__decorate([
    (0, common_1.Patch)('rentals/:id/return'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ApiController.prototype, "returnRentalMaterial", null);
__decorate([
    (0, common_1.Delete)('rentals/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ApiController.prototype, "deleteRentalMaterial", null);
__decorate([
    (0, common_1.Post)('deliveries'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ApiController.prototype, "receiveMaterial", null);
__decorate([
    (0, common_1.Post)('bookings'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ApiController.prototype, "addLabourBooking", null);
__decorate([
    (0, common_1.Delete)('bookings/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ApiController.prototype, "cancelLabourBooking", null);
exports.ApiController = ApiController = __decorate([
    (0, common_1.Controller)('api'),
    __metadata("design:paramtypes", [api_service_1.ApiService])
], ApiController);
//# sourceMappingURL=api.controller.js.map