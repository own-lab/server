import { BaseService } from '@home-lab/server/core/services/base.service';
import { Injectable } from '@nestjs/common';
import { Role } from '../../entities';

@Injectable()
export class RoleService extends BaseService(Role) {}
