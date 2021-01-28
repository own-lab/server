import { Injectable, Logger } from '@nestjs/common';
import { exec } from 'child_process';
import { forkJoin, Observable, throwError } from 'rxjs';
import { catchError, defaultIfEmpty, map, switchMap } from 'rxjs/operators';
import { DockerImage, DockerNetwork, DockerVolume } from '../../entities';
import { DockerContainer } from '../../entities/docker-container.entity';
import {
  dockerContainerMapper,
  dockerImageMapper,
  dockerNetworkMapper,
  dockerVolumeMapper,
} from '../../mappers';

const applyFilter = <T>(query: Partial<T>) => (element: T): boolean => {
  for (const [key, value] of Object.entries(query)) {
    if (element[key] !== value) {
      return false;
    }
  }

  return true;
};

export interface Result {
  success: boolean;
  message?: string;
}

@Injectable()
export class DockerService {
  private readonly logger = new Logger(DockerService.name);

  getImages(query: Partial<DockerImage> = {}): Observable<DockerImage[]> {
    return this.execAndParse(
      '/usr/bin/docker images --format "{{json . }}"'
    ).pipe(
      map((results) =>
        results.map(dockerImageMapper).filter(applyFilter(query))
      ),
      catchError((error) => {
        this.logger.error(error.message);
        return [];
      })
    );
  }

  geOneImage(query: Partial<DockerImage>): Observable<DockerImage> {
    return this.getImages(query).pipe(map((elements) => elements[0]));
  }

  pullImage(query: Partial<DockerImage> = {}): Observable<Result> {
    return this.getImages(query).pipe(
      defaultIfEmpty([] as DockerImage[]),
      switchMap((dockerImages) =>
        dockerImages.length !== 0
          ? throwError('This image is already pulled')
          : this.exec(`/usr/bin/docker image pull ${query.repository}`).pipe(
              map(() => ({ success: true }))
            )
      )
    );
  }

  deleteImage(query: Partial<DockerImage> = {}): Observable<Result> {
    return this.getImages(query).pipe(
      defaultIfEmpty([] as DockerImage[]),
      switchMap((dockerImages) =>
        dockerImages.length === 0
          ? throwError('No such images')
          : forkJoin(
              dockerImages.map((dockerImage) =>
                this.exec(`/usr/bin/docker image rm ${dockerImage.id}`)
              )
            ).pipe(map(() => ({ success: true })))
      )
    );
  }

  getContainers(
    query: Partial<DockerContainer> = {}
  ): Observable<DockerContainer[]> {
    return this.execAndParse(
      '/usr/bin/docker ps -a --format "{{json . }}"'
    ).pipe(
      map((results) =>
        results.map(dockerContainerMapper).filter(applyFilter(query))
      ),
      catchError((error) => {
        this.logger.error(error.message);
        return [];
      })
    );
  }

  getOneContainer(
    query: Partial<DockerContainer>
  ): Observable<DockerContainer> {
    return this.getContainers(query).pipe(map((elements) => elements[0]));
  }

  runContainer(
    query: Partial<DockerContainer> & { repository: string }
  ): Observable<Result> {
    const { repository, name = repository } = query;
    return this.exec(
      `/usr/bin/docker run --name ${name} -d ${repository}`
    ).pipe(map(() => ({ success: true })));
  }

  startContainer(id: string): Observable<Result> {
    return this.exec(`/usr/bin/docker start ${id}`).pipe(
      map(() => ({ success: true }))
    );
  }

  stopContainer(id: string): Observable<Result> {
    return this.exec(`/usr/bin/docker stop -t 0 ${id}`).pipe(
      map(() => ({ success: true }))
    );
  }

  getVolumes(query: Partial<DockerVolume> = {}): Observable<DockerVolume[]> {
    return this.execAndParse(
      '/usr/bin/docker volume ls --format "{{json . }}"'
    ).pipe(
      map((results) =>
        results.map(dockerVolumeMapper).filter(applyFilter(query))
      ),
      catchError((error) => {
        this.logger.error(error.message);
        return [];
      })
    );
  }

  getOneVolume(query: Partial<DockerVolume> = {}): Observable<DockerVolume> {
    return this.getVolumes(query).pipe(map((elements) => elements[0]));
  }

  createVolume(volume: Partial<DockerVolume>): Observable<Result> {
    return this.getOneVolume(volume).pipe(
      switchMap((dockerVolume) => {
        if (dockerVolume !== undefined) {
          return throwError('Volume already exist');
        }

        return this.exec(`/usr/bin/docker volume create ${volume.name}`).pipe(
          map(() => ({ success: true }))
        );
      })
    );
  }

  pruneVolumes(): Observable<Result> {
    return this.exec(`/usr/bin/docker volume prune -f`).pipe(
      map(() => ({ success: true }))
    );
  }

  deleteVolume(query: Partial<DockerVolume> = {}): Observable<Result> {
    return this.getVolumes(query).pipe(
      defaultIfEmpty([] as DockerVolume[]),
      switchMap((dockerVolumes) =>
        dockerVolumes.length === 0
          ? throwError('No such volumes')
          : forkJoin(
              dockerVolumes.map((dockerVolume) =>
                this.exec(`/usr/bin/docker volume rm ${dockerVolume.name}`)
              )
            ).pipe(map(() => ({ success: true })))
      )
    );
  }

  getNetworks(query: Partial<DockerNetwork> = {}): Observable<DockerNetwork[]> {
    return this.execAndParse(
      '/usr/bin/docker network ls --format "{{json . }}"'
    ).pipe(
      map((results) =>
        results.map(dockerNetworkMapper).filter(applyFilter(query))
      ),
      catchError((error) => {
        this.logger.error(error.message);
        return [];
      })
    );
  }

  getOneNetwork(query: Partial<DockerNetwork>): Observable<DockerNetwork> {
    return this.getNetworks(query).pipe(map((elements) => elements[0]));
  }

  private exec(command: string): Observable<string> {
    return new Observable((subsriber) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          return subsriber.error(error);
        } else if (stderr) {
          return subsriber.error(stderr);
        }

        subsriber.next(stdout);
        subsriber.complete();
      });
    });
  }

  private execAndParse<T>(command: string): Observable<T[]> {
    return this.exec(command).pipe(
      map((stdout) => {
        try {
          return stdout
            .split('\n')
            .filter((el) => el !== '')
            .map((string) => JSON.parse(string));
        } catch (e) {
          throwError(e);
        }
      })
    );
  }
}
