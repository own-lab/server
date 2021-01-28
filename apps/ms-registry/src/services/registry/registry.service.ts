import { Injectable, Logger } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MicroserviceHealthIndicator } from '@nestjs/terminus';
import { ServiceDefinition } from 'libs/shared/src';
import { Observable, of } from 'rxjs';

const START_TCP_PORT = 9090;
const START_HTTP_PORT = 8081;

@Injectable()
export class RegistryService {
  private readonly logger = new Logger(RegistryService.name);
  private readonly services: { [serviceId: string]: ServiceDefinition } = {};

  public constructor(
    private microserviceHealthIndicator: MicroserviceHealthIndicator
  ) {}

  public register(serviceId: string): Observable<ServiceDefinition> {
    if (this.has(serviceId)) {
      return null;
    }

    const serviceDefinition: ServiceDefinition = {
      tcpPort: this.nextFreeTcpPort(),
      httpPort: this.nextFreeHttpPort(),
      serviceName: serviceId,
      host: '0.0.0.0',
    };

    this.logger.debug(
      `Registering service ${serviceId} with HTTP[${serviceDefinition.httpPort}] TCP[${serviceDefinition.tcpPort}]`
    );
    this.services[serviceId] = serviceDefinition;
    return of(serviceDefinition);
  }

  public remove(serviceId: string): void {
    delete this.services[serviceId];
  }

  public get(serviceId: string): ServiceDefinition {
    return this.services[serviceId];
  }

  public getAll(): ServiceDefinition[] {
    return Object.values(this.services);
  }

  public has(serviceId: string): boolean {
    return this.get(serviceId) !== undefined;
  }

  private nextFreeHttpPort(): number {
    let port = START_HTTP_PORT;
    while (
      Object.values(this.services).some((service) => service.httpPort === port)
    ) {
      port++;
    }

    return port;
  }

  private nextFreeTcpPort(): number {
    let port = START_TCP_PORT;
    while (
      Object.values(this.services).some((service) => service.tcpPort === port)
    ) {
      port++;
    }

    return port;
  }

  @Cron(CronExpression.EVERY_5_SECONDS)
  private checkHealth(): void {
    this.logger.debug(
      `Running healthcheck on ${Object.keys(this.services).length} services`
    );
    Object.entries(this.services).forEach(([serviceId, serviceDefinition]) =>
      this.microserviceHealthIndicator
        .pingCheck('tcp', {
          transport: Transport.TCP,
          options: { host: '0.0.0.0', port: serviceDefinition.tcpPort },
        })
        .catch(() => {
          this.logger.debug(`removing ${serviceId}`);
          this.remove(serviceId);
        })
    );
  }
}
