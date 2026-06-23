import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { ApiService } from './api.service';

@Controller('api')
export class ApiController {
  constructor(private readonly apiService: ApiService) {}

  @Get('sites')
  getSites() {
    return this.apiService.getSites();
  }

  @Get('workers')
  getWorkers() {
    return this.apiService.getWorkers();
  }

  @Get('materials')
  getMaterials() {
    return this.apiService.getMaterials();
  }

  @Get('deliveries')
  getDeliveries() {
    return this.apiService.getDeliveries();
  }

  @Get('transactions')
  getTransactions() {
    return this.apiService.getTransactions();
  }

  @Get('attendance')
  getAttendanceRecords() {
    return this.apiService.getAttendanceRecords();
  }

  @Get('rentals')
  getRentals() {
    return this.apiService.getRentals();
  }

  @Get('bookings')
  getBookings() {
    return this.apiService.getBookings();
  }

  @Post('workers')
  addWorker(
    @Body()
    body: {
      name: string;
      role: string;
      dailyRate: number;
      siteId: string;
      phone: string;
      employmentType: string;
    },
  ) {
    return this.apiService.addWorker(body);
  }

  @Patch('attendance')
  updateWorkerAttendance(
    @Body()
    body: {
      workerId: string;
      status: string;
      overtimeHours: number;
      date?: string;
    },
  ) {
    return this.apiService.updateWorkerAttendance(body.workerId, body.status, body.overtimeHours, body.date);
  }

  @Post('payments')
  payWorker(
    @Body()
    body: {
      workerId: string;
      amount: number;
      paymentMode: string;
      type: 'Wage Payment' | 'Advance Payment';
    },
  ) {
    return this.apiService.payWorker(body.workerId, body.amount, body.paymentMode, body.type);
  }

  @Delete('transactions/:id')
  deleteAdvanceTransaction(@Param('id') id: string) {
    return this.apiService.deleteAdvanceTransaction(id);
  }

  @Post('rentals')
  addRentalMaterial(
    @Body()
    body: {
      name: string;
      size: string;
      quantity: number;
      ratePerDay: number;
      supplierName: string;
      startDate: string;
      siteId: string;
    },
  ) {
    return this.apiService.addRentalMaterial(body);
  }

  @Patch('rentals/:id/return')
  returnRentalMaterial(
    @Param('id') id: string,
    @Body() body: { endDate: string },
  ) {
    return this.apiService.returnRentalMaterial(id, body.endDate);
  }

  @Delete('rentals/:id')
  deleteRentalMaterial(@Param('id') id: string) {
    return this.apiService.deleteRentalMaterial(id);
  }

  @Post('deliveries')
  receiveMaterial(
    @Body()
    body: {
      siteId: string;
      materialName: string;
      supplierName: string;
      quantity: number;
      unit: string;
      ratePerUnit: number;
    },
  ) {
    return this.apiService.receiveMaterial(
      body.siteId,
      body.materialName,
      body.supplierName,
      body.quantity,
      body.unit,
      body.ratePerUnit,
    );
  }

  @Post('bookings')
  addLabourBooking(
    @Body()
    body: {
      workerId: string;
      siteId: string;
      bookingDate: string;
      dailyRate: number;
      remarks: string;
    },
  ) {
    return this.apiService.addLabourBooking(body);
  }

  @Delete('bookings/:id')
  cancelLabourBooking(@Param('id') id: string) {
    return this.apiService.cancelLabourBooking(id);
  }
}
