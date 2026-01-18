import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Csr, CsrSchema } from './csr.schema';
import { CsrService } from './csr.service';
import { CsrController } from './csr.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Csr.name, schema: CsrSchema },
    ]),
  ],
  controllers: [CsrController],
  providers: [CsrService],
})
export class CsrModule {}
