import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    console.log('🔒 JWT Guard - Path:', request.path);
    console.log('🍪 JWT Guard - Cookies:', request.cookies ? Object.keys(request.cookies) : 'NO COOKIES');
    
    // Check Authorization header
    const authHeader = request.headers.authorization;
    if (authHeader) {
      console.log('🔐 Authorization header found:', authHeader.substring(0, 30) + '...');
    } else {
      console.log('❌ No Authorization header');
    }
    
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      console.log('❌ JWT Guard - Authentication failed');
      console.log('   Error:', err?.message || 'No error');
      console.log('   Info:', info?.message || info);
      console.log('   User:', user ? 'Found' : 'Not found');
      throw err || new UnauthorizedException('Invalid or missing authentication token');
    }
    console.log('✅ JWT Guard - User authenticated:', user.email);
    return user;
  }
}
