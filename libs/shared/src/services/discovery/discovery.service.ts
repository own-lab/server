import { HttpService, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ServiceDefinition {
  tcpPort: number;
  httpPort: number;
  serviceName: string;
  host: string;
}

@Injectable()
export class DiscoveryService {
  constructor(private readonly httpClient: HttpService) {}

  register(serviceId: string): Observable<ServiceDefinition> {
    return this.httpClient
      .post<ServiceDefinition>(`http://localhost:8080/registry/register`, {
        serviceId,
      })
      .pipe(map((response) => response.data));
  }

  getConfig(serviceId: string): Observable<ServiceDefinition> {
    return this.httpClient
      .get<ServiceDefinition>(`http://localhost:8080/registry/get/${serviceId}`)
      .pipe(map((response) => response.data));
  }
}
