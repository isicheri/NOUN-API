import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { AuthService } from "./auth.service";
import { PrismaService } from "src/prisma/prisma.service";
import { LocalStrategy } from "./strategies/local.strategy";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { GoogleStrategy } from "./strategies/google.strategy";



@Module({
    imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secretKey',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [AuthService, PrismaService, LocalStrategy, JwtStrategy,GoogleStrategy],
  controllers: [AuthController],
})
export class AuthModule {}