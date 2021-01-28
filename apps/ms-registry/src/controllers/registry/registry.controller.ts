import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ServiceDefinition } from 'libs/shared/src';
import { Observable } from 'rxjs';
import { RegistryService } from '../../services/registry/registry.service';

@Controller('/registry')
export class RegistryController {
  constructor(private readonly registryService: RegistryService) {}

  @Post('/register')
  register(
    @Body('serviceId') serviceId: string
  ): Observable<ServiceDefinition> {
    return this.registryService.register(serviceId);
  }

  @Get('/get')
  getAll(): ServiceDefinition[] {
    return this.registryService.getAll();
  }

  @Get('/get/:serviceId')
  get(@Param('serviceId') serviceId: string): ServiceDefinition {
    return this.registryService.get(serviceId);
  }
}
