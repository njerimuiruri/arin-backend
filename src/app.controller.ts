
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Connection } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('db-status')
  async getDbStatus() {
    const state = this.connection.readyState;
    let status = 'disconnected';
    if (state === 1) status = 'connected';
    else if (state === 2) status = 'connecting';
    else if (state === 3) status = 'disconnecting';
    return { status };
  }
}
