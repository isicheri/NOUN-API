  import { BadRequestException, Injectable,UnauthorizedException } from "@nestjs/common";
  import { PrismaService } from "src/prisma/prisma.service";
  import { JwtService } from "@nestjs/jwt";
  import * as bcrypt from "bcrypt";
  import { AuthDto, CreateUserDto } from "./dto/auth-dto";


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
  if (!user || !user.password) {
    throw new UnauthorizedException('Invalid email or password');
  }

  const isMatch = await bcrypt.compare(pass, user.password);
  if (!isMatch) {
    throw new UnauthorizedException('Invalid email or password');
  }

  const { password, ...result } = user;
  return result;
    }


  async signup({fullName,email,password}:CreateUserDto) {
      const user = await this.prisma.user.findUnique({ where: { email } });
      if(user) {
          throw new BadRequestException("User Already Exists");
      }
      const hashed = await bcrypt.hash(password, 10);
      return this.prisma.user.create({
          data: {
            email,
            password: hashed,
            profile: {
              create: {name: fullName}
            }
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
        const validUser = await this.prisma.user.findUnique({where: {id: user.id},include: {profile: true}});
        return {
          access_token: this.jwtService.sign(payload),
          role: user.role, 
          user: {id: user.id,email: user.email,profile: { name: validUser?.profile?.name,imageUrl: null }}
          };
      }


  }