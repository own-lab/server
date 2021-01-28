import { BaseService } from '@home-lab/server/core/services/base.service';
import { Injectable } from '@nestjs/common';
import { User } from '../../entities';

@Injectable()
export class UserService extends BaseService(User) {}
