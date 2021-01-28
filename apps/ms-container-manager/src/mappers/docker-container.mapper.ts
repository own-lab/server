import {
  DockerContainer,
  Protocol,
  State,
} from '../entities/docker-container.entity';

interface DockerContainerJson {
  Command: string;
  CreatedAt: string;
  ID: string;
  Image: string;
  Labels: string;
  LocalVolumes: string;
  Mounts: string;
  Names: string;
  Networks: string;
  Ports: string;
  RunningFor: string;
  Size: string;
  State: State;
  Status: string;
}

export const dockerContainerMapper = (
  json: DockerContainerJson
): DockerContainer => ({
  id: json.ID,
  createdAt: new Date(json.CreatedAt),
  state: json.State,
  name: json.Names,
  ports:
    json.Ports === ''
      ? []
      : json.Ports.split(', ').map((string) => {
          const [host, containerTemp] = string.split('-\u003e');
          const [container, protocol] = containerTemp.split('/');

          return {
            host: parseInt(host.replace('0.0.0.0:', '')),
            container: parseInt(container),
            protocol: protocol as Protocol,
          };
        }),
});
