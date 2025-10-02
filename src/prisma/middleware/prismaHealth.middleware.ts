import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { PrismaService } from '../prisma.service';
@Injectable()
export class PrismaHealthMiddleware implements NestMiddleware {
  private lastCheck = 0;
  private isConnected = true;
  constructor(private prismaService: PrismaService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const now = Date.now();
    if (now - this.lastCheck > 5000) {
      // every 5 seconds
      this.isConnected = await this.prismaService.isDbConnected();
      this.lastCheck = now;
    }
    if (!this.isConnected) {
      return res.status(503).json({
        message: 'Our Service Is currently unavailable',
      });
    }
    next();
  }
}
