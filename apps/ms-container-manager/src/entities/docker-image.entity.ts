export interface DockerImage {
  id: string;
  createdAt: Date;
  digest: string;
  size: string;
  repository: string;
  tag: string;
}
