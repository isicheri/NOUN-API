// src/auth/strategies/google.strategy.ts
/* eslint-disable  @typescript-eslint/no-unsafe-argument
 */
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    super({
      clientID: configService.getOrThrow<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.getOrThrow<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL:
        configService.get<string>('GOOGLE_CALLBACK_URL') ??
        'http://localhost:3000/auth/google/callback',
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<void> {
    try {
      const { id, emails, displayName } = profile;
      const email: string = emails?.[0]?.value ?? '';

      const user = await this.authService.validateGoogleUser(
        id,
        email,
        displayName,
      );

      // ✅ Explicit void return, no unsafe-return
      done(null, user);
    } catch (err: unknown) {
      // ✅ Safe error conversion
      const error =
        err instanceof Error ? err : new Error('Google authentication failed');
      done(error, false);
    }
  }
}
