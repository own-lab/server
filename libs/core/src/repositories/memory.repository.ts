import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { AbstractRepository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { BaseEntity } from '../entities/base.entity';

export class MemoryRepository<
  T extends BaseEntity
> extends AbstractRepository<T> {
  public constructor(private readonly elements: T[]) {
    super();
  }

  public getAll(query: Partial<T>): Observable<T[]> {
    return of(
      this.elements.filter((el) => {
        for (const [key, value] of Object.entries(query)) {
          if (value !== el[key]) {
            return false;
          }
        }

        return true;
      })
    );
  }

  public getOne(query: Partial<T>): Observable<T> {
    return this.getAll(query).pipe(map((elements) => elements[0]));
  }

  public create(element: Omit<T, 'id'>): Observable<T> {
    const newElement: T = {
      id: uuidv4(),
      ...element,
    } as T;

    this.elements.push(newElement);
    return of(newElement);
  }
}
