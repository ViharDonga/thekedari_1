import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { ApiService } from './api.service';
import { ApiController } from './api.controller';

@Module({
  imports: [],
  controllers: [ApiController],
  providers: [PrismaService, ApiService],
})
export class AppModule {}
