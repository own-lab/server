export interface DockerVolume {
  driver: string;
  labels: string;
  links: string;
  mountpoint: string;
  name: string;
  scope: string;
  size: string;
}
