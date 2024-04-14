import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  enableShutdownHooks(app: INestApplication) {
    // Use o evento 'exit' ao invés do obsoleto 'beforeExit'
    process.on('exit', async () => {
      await this.$disconnect();
      // Opcionalmente feche a aplicação Nest (se necessário)
      await app.close();
    });
  }
}
