import { Test, TestingModule } from '@nestjs/testing';
import { Observable, of } from 'rxjs';
import { User } from '../../entities';
import { UserService } from '../../services';
import { UserController } from './user.controller';

const USERS: User[] = [
  { id: '1', name: 'Angelis', password: 'This is secure' },
  { id: '2', name: 'Sunrizen', password: 'This is not secure' },
];

const userServiceMock: Partial<UserService> = {
  findAll(): Observable<User[]> {
    return of(USERS);
  },
};

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: UserService, useValue: userServiceMock }],
    }).compile();

    controller = app.get<UserController>(UserController);
  });

  describe('root', () => {
    it('should return all users', (done) => {
      controller.findAll().subscribe((users) => {
        expect(users).toEqual(USERS);
        done();
      });
    });
  });
});
