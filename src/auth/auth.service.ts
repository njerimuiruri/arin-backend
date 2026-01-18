import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  private readonly jwtSecret: string;

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    this.jwtSecret = this.configService.get<string>('JWT_SECRET') || 'supersecretkey';
    console.log('🔐 AuthService initialized - JWT Secret length:', this.jwtSecret.length);
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user._id, role: user.role };
    
    // Generate access token (short-lived - 15 minutes)
    const access_token = this.jwtService.sign(payload, {
      secret: this.jwtSecret,
      expiresIn: '15m',
    });
    
    // Generate refresh token (long-lived - 7 days)
    const refresh_token = this.jwtService.sign(payload, {
      secret: this.jwtSecret,
      expiresIn: '7d',
    });
    
    return {
      access_token,
      refresh_token,
    };
  }

  async refreshTokens(refreshToken: string) {
    try {
      console.log('🔄 Verifying refresh token...');
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.jwtSecret,
      });
      console.log('   ✅ Refresh token verified');
      const user = { email: payload.email, _id: payload.sub, role: payload.role };
      return this.login(user);
    } catch (error) {
      console.log('   ❌ Refresh token verification failed:', error.message);
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
