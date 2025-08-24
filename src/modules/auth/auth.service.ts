import { BadRequestException, Injectable,UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { AuthDto } from "./dto/auth-dto";


@Injectable() 
export class AuthService {
    constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

 // validate for LocalStrategy
  async validateUser(email: string,
    pass: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || !user.password) return null;

    const isMatch = await bcrypt.compare(pass, user.password);
    if (isMatch) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }


async signup({email,password}:AuthDto) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if(user) {
        throw new BadRequestException("User Already Exists");
    }
    const hashed = await bcrypt.hash(password, 10);
    return this.prisma.user.create({
        data: {
          email,
          password: hashed,

        }
    })
  }


async validateGoogleUser(providerId: string, email: string, name: string) {
   let user = await this.prisma.user.findUnique({ where: { email } });

  if (!user) {
    user = await this.prisma.user.create({
      data: {
        email,
        password: null, // Google login, no password
        role: 'STUDENT',
        profile: {
          create: { name },
        },
        // optionally store googleId in a new column for future use
        providerId
      },
    });
  }

  // Generate JWT
  const payload = { sub: user.id, email: user.email, role: user.role };
  const token = this.jwtService.sign(payload);

  return { user, accessToken: token };
}


  async login(user: any) {
    const payload = { sub: user.id, email: user.email, role: user.role };
     return {
    access_token: this.jwtService.sign(payload),
    role: user.role, 
  };
  }


}