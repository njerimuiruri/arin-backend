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
    res.clearCookie('arin_token', {
      httpOnly: true,
      secure: false, // Set to false for local development
      sameSite: 'lax',
      path: '/', // Add explicit path
    });
    return { message: 'Logged out successfully' };
  }

  @Post('login')
  async login(
    @Body() body: { email: string; password: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authService.validateUser(body.email, body.password);
    const loginResult = await this.authService.login(user);
    
    // Set JWT as HTTP-only cookie
    res.cookie('arin_token', loginResult.access_token, {
      httpOnly: true,
      secure: false, // Set to false for local development (localhost uses HTTP not HTTPS)
      sameSite: 'lax',
      maxAge: 60 * 60 * 1000, // 1 hour
      path: '/', // Explicitly set path
    });
    
    return { 
      message: 'Login successful',
      user: { 
        email: user.email, 
        role: user.role 
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
    // req.user is set by JwtStrategy
    return req.user;
  }
}