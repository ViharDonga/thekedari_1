import { Injectable, UnauthorizedException, BadRequestException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { PrismaService } from './prisma.service';

export interface AuthUser {
  id: string;
  username: string;
  name: string;
  role: 'ADMIN' | 'SUPERVISOR' | 'LABOUR';
  siteId?: string | null;
  workerId?: string | null;
}

export interface JwtPayload {
  sub: string;
  username: string;
  role: 'ADMIN' | 'SUPERVISOR' | 'LABOUR';
  siteId?: string | null;
  workerId?: string | null;
}

@Injectable()
export class AuthService {
  private readonly jwtSecret = process.env.JWT_SECRET || 'thekedari-dev-secret-change-in-production';

  constructor(private prisma: PrismaService) {}

  async login(username: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { username } });
    if (!user) {
      throw new UnauthorizedException('Invalid username or password');
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedException('Invalid username or password');
    }

    const payload: JwtPayload = {
      sub: user.id,
      username: user.username,
      role: user.role,
      siteId: user.siteId,
      workerId: user.workerId,
    };

    const token = jwt.sign(payload, this.jwtSecret, { expiresIn: '7d' });

    return {
      token,
      user: this.toAuthUser(user),
    };
  }

  async getProfile(userId: string): Promise<AuthUser> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return this.toAuthUser(user);
  }

  verifyToken(token: string): JwtPayload {
    try {
      return jwt.verify(token, this.jwtSecret) as JwtPayload;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  async register(data: {
    username: string;
    password: string;
    name: string;
    role: 'SUPERVISOR' | 'LABOUR';
  }) {
    if (!data.username?.trim() || !data.password || !data.name?.trim()) {
      throw new BadRequestException('All required fields must be filled');
    }

    if (data.password.length < 6) {
      throw new BadRequestException('Password must be at least 6 characters');
    }

    const existing = await this.prisma.user.findUnique({ where: { username: data.username.trim() } });
    if (existing) {
      throw new ConflictException('Username already taken');
    }

    const passwordHash = await bcrypt.hash(data.password, 10);
    const user = await this.prisma.user.create({
      data: {
        username: data.username.trim(),
        passwordHash,
        name: data.name.trim(),
        role: data.role,
        siteId: null,
        workerId: null,
      },
    });

    return {
      message: 'Account created. Login after admin assigns your site.',
      user: this.toAuthUser(user),
    };
  }

  async listUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        username: true,
        name: true,
        role: true,
        siteId: true,
        workerId: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async assignUserSite(userId: string, siteId: string, workerId?: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    if (user.role === 'ADMIN') {
      throw new BadRequestException('Admin site assignment is not allowed');
    }

    const site = await this.prisma.constructionSite.findUnique({ where: { id: siteId } });
    if (!site) {
      throw new BadRequestException('Site not found');
    }

    let linkedWorkerId: string | null = null;
    if (user.role === 'LABOUR') {
      if (!workerId) {
        throw new BadRequestException('Labour users must be linked to a worker profile');
      }
      const worker = await this.prisma.worker.findUnique({ where: { id: workerId } });
      if (!worker || worker.siteId !== siteId) {
        throw new BadRequestException('Worker does not belong to selected site');
      }
      const linked = await this.prisma.user.findFirst({
        where: { workerId, NOT: { id: userId } },
      });
      if (linked) {
        throw new ConflictException('This worker is already linked to another account');
      }
      linkedWorkerId = workerId;
    }

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: { siteId, workerId: linkedWorkerId },
    });

    return this.toAuthUser(updated);
  }

  async getPublicSites() {
    return this.prisma.constructionSite.findMany({
      select: { id: true, name: true, location: true },
      orderBy: { name: 'asc' },
    });
  }

  async getPublicWorkers(siteId: string) {
    return this.prisma.worker.findMany({
      where: { siteId },
      select: { id: true, name: true, role: true, phone: true },
      orderBy: { name: 'asc' },
    });
  }

  private toAuthUser(user: {
    id: string;
    username: string;
    name: string;
    role: 'ADMIN' | 'SUPERVISOR' | 'LABOUR';
    siteId: string | null;
    workerId: string | null;
  }): AuthUser {
    return {
      id: user.id,
      username: user.username,
      name: user.name,
      role: user.role,
      siteId: user.siteId,
      workerId: user.workerId,
    };
  }
}
