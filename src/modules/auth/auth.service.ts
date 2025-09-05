  import { BadRequestException, Injectable,UnauthorizedException } from "@nestjs/common";
  import { PrismaService } from "src/prisma/prisma.service";
  import { JwtService } from "@nestjs/jwt";
  import * as bcrypt from "bcrypt";
  import { AuthDto, CreateUserDto } from "./dto/auth-dto";
import { EmailService } from "src/utilities/email/email.service";
import { EmailMessageBody } from "src/utilities/email/types/email.interface";
import { ConfigService } from "@nestjs/config";


  @Injectable() 
  export class AuthService {
      constructor(
      private prisma: PrismaService,
      private jwtService: JwtService,
      private emailService: EmailService,
      private configService: ConfigService
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

async RequestResetPassword({ email }: Partial<AuthDto>,from:string) {
  if (!email) {
    throw new BadRequestException("Email is required.");
  }
  const user = await this.prisma.user.findUnique({ where: { email } });
  if (!user) {
    return {message: "Email not found!", success: false}; 
  }
  const token = await this.jwtService.sign({ email }, { expiresIn: '15m' });

  // 4. Create a reset link (replace with your actual front-end URL)
  const resetLink = `${this.configService.get<string>('FRONTEND_MAIN_URL')}/auth/reset_password?token=${token}`;

  // 5. Build the email content
const htmlContent = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #ffffff;">
    <!-- Logo -->
    <div style="text-align: center; margin-bottom: 20px;">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 120" width="160" height="50" role="img" aria-labelledby="title desc">
        <title id="title">Nounedu Logo</title>
        <desc id="desc">A stylized open-book icon with a graduation cap, with Nounedu branding in greenyellow.</desc>
        <defs>
          <linearGradient id="bookGrad" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stop-color="#ADFF2F"/>
            <stop offset="1" stop-color="#9ACD32"/>
          </linearGradient>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#000" flood-opacity="0.2"/>
          </filter>
        </defs>
        <g transform="translate(20,20)" filter="url(#shadow)">
          <path d="M0,0 L40,30 L0,60 Z" fill="url(#bookGrad)" />
          <path d="M40,0 L80,30 L40,60 Z" fill="url(#bookGrad)" />
          <polygon points="10,10 40,0 70,10 40,20" fill="#2F4F2F"/>
          <line x1="40" y1="20" x2="40" y2="30" stroke="#2F4F2F" stroke-width="2"/>
        </g>
        <text x="110" y="70" font-family="Inter, system-ui, Arial" font-size="48" font-weight="700" fill="#2F4F2F">
          Nounedu
        </text>
      </svg>
    </div>

    <h2 style="color: #2F4F2F;">Password Reset Request</h2>
    <p style="font-size: 16px; color: #333;">
      Hello,
    </p>
    <p style="font-size: 16px; color: #333;">
      You requested to reset your password. Click the button below to proceed:
    </p>

    <div style="text-align: center; margin: 30px 0;">
      <a href="${resetLink}" 
         style="background-color: #ADFF2F; color: #2F4F2F; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
        Reset Password
      </a>
    </div>

    <p style="font-size: 14px; color: #555;">
      Or copy and paste this link into your browser:
    </p>
    <p style="font-size: 14px; color: #2F4F2F; word-break: break-word;">
      ${resetLink}
    </p>

    <hr style="margin: 40px 0; border: none; border-top: 1px solid #eeeeee;">

    <p style="font-size: 12px; color: #999999;">
      If you did not request a password reset, you can safely ignore this email.
    </p>
  </div>
`;

  // 6. Send the email
  const mailResponse = await this.emailService.sendMail({to: email,from:from || "no-reply@nounedu.net"}, htmlContent,"Password Reset Request");

  return {...mailResponse};
}

async ResetPassword(jwtToken: string, { password }: Partial<AuthDto>) {
  if (!jwtToken) {
    throw new UnauthorizedException("Missing or invalid reset token.");
  }

  if (!password || password.length < 6) {
    throw new BadRequestException("Password must be at least 6 characters long.");
  }

  let decoded;
  try {
    decoded = this.jwtService.verify(jwtToken); // throws error if expired or invalid
  } catch (error) {
    throw new UnauthorizedException("Invalid or expired token.");
  }

  const email = decoded?.email;
  if (!email) {
    throw new UnauthorizedException("Invalid token payload.");
  }

  const user = await this.prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new BadRequestException("User not found.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await this.prisma.user.update({
    where: { email },
    data: { password: hashedPassword },
  });

  return {
    success: true,
    message: "Password has been reset successfully.",
  };
}


  }