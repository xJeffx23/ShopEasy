import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('✅ Prisma conectado a la base de datos');
    } catch {
      this.logger.warn(
        '⚠️  Base de datos no disponible - continuando sin conexión',
      );
    }
  }
}
