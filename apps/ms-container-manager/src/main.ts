import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { DiscoveryService } from 'libs/shared/src';
import { ErrorInterceptor } from 'libs/shared/src/interceptors';
import { ContainerManagerModule } from './container-manager.module';

async function bootstrap() {
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create(ContainerManagerModule);
  app.useGlobalInterceptors(new ErrorInterceptor());

  const serviceConfig = await app
    .get(DiscoveryService)
    .register('ms-container-manager')
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
