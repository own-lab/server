import { BaseController } from '@home-lab/server/core/controllers/base.controller';
import { Controller } from '@nestjs/common';
import { User } from '../../entities';
import { UserService } from '../../services';

@Controller('/users')
export class UserController extends BaseController<User>(UserService) {}
