import { BaseController } from '@home-lab/server/core/controllers/base.controller';
import { Controller } from '@nestjs/common';
import { Role } from '../../entities';
import { RoleService } from '../../services';

@Controller('/roles')
export class RoleController extends BaseController<Role>(RoleService) {}
