import { Injectable } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { DiscoveryService } from 'libs/shared/src';
import { Observable } from 'rxjs';

@Injectable()
export class AuthenticationService {
  private authenticationClientProxy: ClientProxy;

  public constructor(private readonly discoveryService: DiscoveryService) {
    this.discoveryService
      .getConfig('ms-authentication')
      .subscribe((serviceConfig) => {
        this.authenticationClientProxy = ClientProxyFactory.create({
          transport: Transport.TCP,
          options: { host: serviceConfig.host, port: serviceConfig.tcpPort },
        });
      });
  }

  public authenticate(name: string, password: string): Observable<boolean> {
    return this.authenticationClientProxy.send('authenticate', {
      name,
      password,
    });
  }
}
