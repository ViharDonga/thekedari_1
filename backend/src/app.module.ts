import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { ApiService } from './api.service';
import { ApiController } from './api.controller';
import { DownloadController } from './download.controller';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { RolesGuard } from './roles.guard';

@Module({
  imports: [],
  controllers: [ApiController, DownloadController],
  providers: [PrismaService, ApiService, AuthService, AuthGuard, RolesGuard],
})
export class AppModule {}
