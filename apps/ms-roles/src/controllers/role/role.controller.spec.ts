import { Test, TestingModule } from '@nestjs/testing';
import { Observable, of } from 'rxjs';
import { Role } from '../../entities';
import { RoleService } from '../../services';
import { RoleController } from './role.controller';

const ROLES: Role[] = [
  { id: '1', name: 'ADMIN' },
  { id: '2', name: 'USER' },
];

const roleServiceMock: Partial<RoleService> = {
  findAll(): Observable<Role[]> {
    return of(ROLES);
  },
};

describe('RoleController', () => {
  let controller: RoleController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [RoleController],
      providers: [{ provide: RoleService, useValue: roleServiceMock }],
    }).compile();

    controller = app.get<RoleController>(RoleController);
  });

  describe('root', () => {
    it('should return all roles', (done) => {
      controller.findAll().subscribe((roles) => {
        expect(roles).toEqual(ROLES);
        done();
      });
    });
  });
});
