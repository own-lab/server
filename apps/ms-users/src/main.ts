import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { DiscoveryService } from 'libs/shared/src';
import 'reflect-metadata';
import { UserModule } from './user.module';

async function bootstrap() {
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create(UserModule);

  const serviceConfig = await app
    .get(DiscoveryService)
    .register('ms-users')
    .toPromise();

  app.connectMicroservice({
    transport: Transport.TCP,
    options: { host: serviceConfig.host, port: serviceConfig.tcpPort },
  });

  await app.startAllMicroservicesAsync();
  await app.listen(serviceConfig.httpPort);
  logger.debug(`Started microservice ${serviceConfig.serviceName}`);
}
bootstrap();
