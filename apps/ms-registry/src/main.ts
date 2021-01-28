import { NestFactory } from '@nestjs/core';
import { RegistryModule } from './registry.module';

async function bootstrap() {
  const app = await NestFactory.create(RegistryModule);
  await app.listen(8080);
}
bootstrap();
