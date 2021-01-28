import { Injectable } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { DiscoveryService } from 'libs/shared/src';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../../interfaces';

@Injectable()
export class UserService {
  private userClientProxy: ClientProxy;

  public constructor(private readonly discoveryService: DiscoveryService) {
    this.discoveryService.getConfig('ms-users').subscribe((serviceConfig) => {
      this.userClientProxy = ClientProxyFactory.create({
        transport: Transport.TCP,
        options: { host: serviceConfig.host, port: serviceConfig.tcpPort },
      });
    });
  }

  public getOneBy(query: Partial<User>): Observable<User> {
    return this.userClientProxy
      .send('list', query)
      .pipe(map((users) => users[0]));
  }
}
