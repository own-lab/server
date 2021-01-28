import { DockerVolume } from '../entities';

interface DockerVolumeJson {
  Driver: string;
  Labels: string;
  Links: string;
  Mountpoint: string;
  Name: string;
  Scope: string;
  Size: string;
}

export const dockerVolumeMapper = (json: DockerVolumeJson): DockerVolume => ({
  driver: json.Driver,
  labels: json.Labels,
  links: json.Links,
  mountpoint: json.Mountpoint,
  name: json.Name,
  scope: json.Scope,
  size: json.Size,
});
