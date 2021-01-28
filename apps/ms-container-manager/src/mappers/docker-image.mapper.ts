import { DockerImage } from '../entities';

interface DockerImageJson {
  Containers: string;
  CreatedAt: string;
  CreatedSince: string;
  Digest: string;
  ID: string;
  Repository: string;
  SharedSize: string;
  Size: string;
  Tag: string;
  UniqueSize: string;
  VirtualSize: string;
}

export const dockerImageMapper = (json: DockerImageJson): DockerImage => ({
  id: json.ID,
  createdAt: new Date(json.CreatedAt),
  digest: json.Digest === '<none>' ? null : json.Digest,
  size: json.Size,
  repository: json.Repository,
  tag: json.Tag === '<none>' ? null : json.Tag,
});
