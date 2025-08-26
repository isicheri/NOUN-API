import { Body, Controller, Post, UseGuards,Req, Request, Get, Res } from "@nestjs/common";
import { LocalAuthGuard } from "./guards/local-guard.guard";
import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "./guards/jwt-guard.guard";
import { AuthDto, CreateUserDto } from "./dto/auth-dto";
import { AuthRequest } from "./types/auth-types";
import { AuthGuard } from '@nestjs/passport';




@Controller("auth")
export class AuthController {

constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(@Body() body: CreateUserDto) {
    return this.authService.signup(body);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: AuthRequest) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('profile')
  getProfile(@Request() req: AuthRequest) {
    return req;
  }   
  
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req,@Res() res) {
    const { accessToken, user } = req.user;
  const role = user.role; // 'STUDENT' or 'ADMIN'
  return res.redirect(`${process.env.FRONTEND_MAIN_URL}/auth/success?token=${accessToken}&role=${role}&redirectTo=${req.query.redirectTo || "/"}`);
  }

  
@UseGuards(LocalAuthGuard)
@Post('logout')
async logout(@Request() req,@Res() res) {
  return res.json({ message: "Logout successful" });
}

}