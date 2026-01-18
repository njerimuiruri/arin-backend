import { Controller, Post, Body, Res, Get, Req, UseGuards } from '@nestjs/common';
import type { Response, Request as ExpressRequest } from 'express';

// Extend Express Request type to include user property
interface AuthenticatedRequest extends ExpressRequest {
  user?: any;
}
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    console.log('👋 User logged out');
    // With localStorage, we just clear client-side
    // No need to set cookies
    return { message: 'Logged out successfully' };
  }

  @Post('login')
  async login(
    @Body() body: { email: string; password: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authService.validateUser(body.email, body.password);
    const loginResult = await this.authService.login(user);
    
    console.log('🔐 Login successful for:', user.email);
    console.log('🎫 Generated access token:', loginResult.access_token.substring(0, 20) + '...');
    console.log('🔄 Generated refresh token:', loginResult.refresh_token.substring(0, 20) + '...');
    console.log('💾 Tokens returned in response body (localStorage)');
    
    return { 
      message: 'Login successful',
      access_token: loginResult.access_token,
      refresh_token: loginResult.refresh_token,
      user: { 
        email: user.email, 
        role: user.role,
        id: user._id
      }
    };
  }

  // Uncomment this to test if auth is working
  @UseGuards(JwtAuthGuard)
  @Get('verify')

  async verify(@Req() req: AuthenticatedRequest) {
    return { 
      authenticated: true, 
      user: req.user 
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Req() req: AuthenticatedRequest) {
    console.log('👤 /auth/me called');
    console.log('🍪 Cookies received:', req.cookies);
    console.log('👥 User from JWT:', req.user);
    // req.user is set by JwtStrategy
    return req.user;
  }

  @Post('refresh')
  async refresh(
    @Body() body: { refresh_token: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = body.refresh_token;
    
    if (!refreshToken) {
      throw new Error('Refresh token not provided');
    }

    console.log('🔄 Refreshing tokens...');
    const tokens = await this.authService.refreshTokens(refreshToken);
    
    console.log('✅ Tokens refreshed successfully');
    
    return { 
      message: 'Tokens refreshed successfully',
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
    };
  }
}