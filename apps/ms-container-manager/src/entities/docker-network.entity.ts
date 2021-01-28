export interface DockerNetwork {
  id: string;
  createdAt: Date;
  driver: string;
  ipv6: boolean;
  internal: boolean;
  labels: string;
  name: string;
  scope: string;
}
