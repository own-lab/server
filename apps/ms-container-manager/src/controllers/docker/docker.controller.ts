import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import {
  DockerContainer,
  DockerImage,
  DockerNetwork,
  DockerVolume,
} from '../../entities';
import { DockerService, Result } from '../../services';

interface CreateVolumeDto {
  name: string;
}

interface PullImageDto {
  repository: string;
}

interface RunContainerDto {
  name?: string;
  repository: string;
}

@Controller('/docker')
export class DockerController {
  constructor(private readonly dockerService: DockerService) {}

  @Get('/images')
  getImages(@Query() query: Partial<DockerImage>): Observable<DockerImage[]> {
    return this.dockerService.getImages(query);
  }

  @Get('/images/:id')
  getImageById(@Param('id') id: string): Observable<DockerImage> {
    return this.dockerService.geOneImage({ id });
  }

  @Post('/images/pull')
  pullImage(@Body() pullImageDto: PullImageDto): Observable<Result> {
    return this.dockerService.pullImage({ ...pullImageDto });
  }

  @Delete('/images/:id')
  deleteImage(@Param('id') id: string): Observable<Result> {
    return this.dockerService.deleteImage({ id });
  }

  @Get('/containers')
  getContainers(
    @Query() query: Partial<DockerContainer>
  ): Observable<DockerContainer[]> {
    return this.dockerService.getContainers(query);
  }

  @Get('/containers/:id')
  getContainerById(@Param('id') id: string): Observable<DockerContainer> {
    return this.dockerService.getOneContainer({ id });
  }

  @Post('/containers/start/:id')
  startContainer(@Param('id') id: string): Observable<Result> {
    return this.dockerService.startContainer(id);
  }

  @Post('/containers/stop/:id')
  stopContainer(@Param('id') id: string): Observable<Result> {
    return this.dockerService.stopContainer(id);
  }

  @Post('/containers/run')
  runContainer(@Body() runContainerDto: RunContainerDto): Observable<Result> {
    return this.dockerService.runContainer({ ...runContainerDto });
  }

  @Get('/volumes')
  getVolumes(
    @Query() query: Partial<DockerVolume>
  ): Observable<DockerVolume[]> {
    return this.dockerService.getVolumes(query);
  }

  @Get('/volumes/:name')
  getVolumeByName(@Param('name') name: string): Observable<DockerVolume> {
    return this.dockerService.getOneVolume({ name });
  }

  @Post('/volumes')
  createVolume(@Body() createVolumeDto: CreateVolumeDto): Observable<Result> {
    return this.dockerService.createVolume({ ...createVolumeDto });
  }

  @Post('/volumes/prune')
  pruneVolumes(): Observable<Result> {
    return this.dockerService.pruneVolumes();
  }

  @Delete('/volumes/:name')
  deleteVolumeByName(@Param('name') name: string): Observable<Result> {
    return this.dockerService.deleteVolume({ name });
  }

  @Get('/networks')
  getNetworks(
    @Query() query: Partial<DockerNetwork>
  ): Observable<DockerNetwork[]> {
    return this.dockerService.getNetworks(query);
  }

  @Get('/networks/:id')
  getNetworkById(@Param('id') id: string): Observable<DockerNetwork> {
    return this.dockerService.getOneNetwork({ id });
  }
}
