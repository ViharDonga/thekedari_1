import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.decorator';
import { CurrentUser } from './current-user.decorator';
import { JwtPayload } from './auth.service';

@Controller('api')
export class ApiController {
  constructor(
    private readonly apiService: ApiService,
    private readonly authService: AuthService,
  ) {}

  @Post('auth/login')
  login(@Body() body: { username: string; password: string }) {
    return this.authService.login(body.username, body.password);
  }

  @Post('auth/register')
  register(
    @Body()
    body: {
      username: string;
      password: string;
      name: string;
      role: 'SUPERVISOR' | 'LABOUR';
    },
  ) {
    return this.authService.register(body);
  }

  @Get('users')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  listUsers() {
    return this.authService.listUsers();
  }

  @Patch('users/:id/assign-site')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  assignUserSite(
    @Param('id') id: string,
    @Body() body: { siteId: string; workerId?: string },
  ) {
    return this.authService.assignUserSite(id, body.siteId, body.workerId);
  }

  @Get('public/sites')
  getPublicSites() {
    return this.authService.getPublicSites();
  }

  @Get('public/workers/:siteId')
  getPublicWorkersBySite(@Param('siteId') siteId: string) {
    return this.authService.getPublicWorkers(siteId);
  }

  @Get('auth/me')
  @UseGuards(AuthGuard)
  getProfile(@CurrentUser() user: JwtPayload) {
    return this.authService.getProfile(user.sub);
  }

  @Get('sites')
  @UseGuards(AuthGuard)
  getSites(@CurrentUser() user: JwtPayload) {
    return this.apiService.getSites(user);
  }

  @Post('sites')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  addSite(
    @CurrentUser() user: JwtPayload,
    @Body()
    body: {
      name: string;
      location: string;
      budget: number;
      supervisorName: string;
    },
  ) {
    return this.apiService.addSite(body, user);
  }

  @Get('workers')
  @UseGuards(AuthGuard)
  getWorkers(@CurrentUser() user: JwtPayload) {
    return this.apiService.getWorkers(user);
  }

  @Get('materials')
  @UseGuards(AuthGuard)
  getMaterials(@CurrentUser() user: JwtPayload) {
    return this.apiService.getMaterials(user);
  }

  @Get('deliveries')
  @UseGuards(AuthGuard)
  getDeliveries(@CurrentUser() user: JwtPayload) {
    return this.apiService.getDeliveries(user);
  }

  @Get('transactions')
  @UseGuards(AuthGuard)
  getTransactions(@CurrentUser() user: JwtPayload) {
    return this.apiService.getTransactions(user);
  }

  @Get('attendance')
  @UseGuards(AuthGuard)
  getAttendanceRecords(@CurrentUser() user: JwtPayload) {
    return this.apiService.getAttendanceRecords(user);
  }

  @Get('rentals')
  @UseGuards(AuthGuard)
  getRentals(@CurrentUser() user: JwtPayload) {
    return this.apiService.getRentals(user);
  }

  @Get('bookings')
  @UseGuards(AuthGuard)
  getBookings(@CurrentUser() user: JwtPayload) {
    return this.apiService.getBookings(user);
  }

  @Post('workers')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPERVISOR')
  addWorker(
    @CurrentUser() user: JwtPayload,
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
    return this.apiService.addWorker(body, user);
  }

  @Patch('attendance')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPERVISOR')
  updateWorkerAttendance(
    @CurrentUser() user: JwtPayload,
    @Body()
    body: {
      workerId: string;
      status: string;
      overtimeHours: number;
      date?: string;
    },
  ) {
    return this.apiService.updateWorkerAttendance(body.workerId, body.status, body.overtimeHours, body.date, user);
  }

  @Post('payments')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPERVISOR')
  payWorker(
    @CurrentUser() user: JwtPayload,
    @Body()
    body: {
      workerId: string;
      amount: number;
      paymentMode: string;
      type: 'Wage Payment' | 'Advance Payment';
    },
  ) {
    return this.apiService.payWorker(body.workerId, body.amount, body.paymentMode, body.type, user);
  }

  @Delete('transactions/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPERVISOR')
  deleteAdvanceTransaction(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.apiService.deleteAdvanceTransaction(id, user);
  }

  @Post('rentals')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPERVISOR')
  addRentalMaterial(
    @CurrentUser() user: JwtPayload,
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
    return this.apiService.addRentalMaterial(body, user);
  }

  @Patch('rentals/:id/return')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPERVISOR')
  returnRentalMaterial(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() body: { endDate: string },
  ) {
    return this.apiService.returnRentalMaterial(id, body.endDate, user);
  }

  @Delete('rentals/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPERVISOR')
  deleteRentalMaterial(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.apiService.deleteRentalMaterial(id, user);
  }

  @Post('deliveries')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPERVISOR')
  receiveMaterial(
    @CurrentUser() user: JwtPayload,
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
      user,
    );
  }

  @Post('bookings')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPERVISOR')
  addLabourBooking(
    @CurrentUser() user: JwtPayload,
    @Body()
    body: {
      workerId: string;
      siteId: string;
      bookingDate: string;
      dailyRate: number;
      remarks: string;
    },
  ) {
    return this.apiService.addLabourBooking(body, user);
  }

  @Delete('bookings/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPERVISOR')
  cancelLabourBooking(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.apiService.cancelLabourBooking(id, user);
  }
}
