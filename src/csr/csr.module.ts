import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { csr, CsrSchema } from './csr.schema';
import { CsrService } from './csr.service';
import { CsrController } from './csr.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: csr.name, schema: CsrSchema },
    ]),
  ],
  controllers: [CsrController],
  providers: [CsrService],
})
export class CsrModule {}
