import { DockerNetwork } from '../entities';

interface DockerNetworkJson {
  CreatedAt: string;
  Driver: string;
  ID: string;
  IPv6: string;
  Internal: string;
  Labels: string;
  Name: string;
  Scope: string;
}

export const dockerNetworkMapper = (
  json: DockerNetworkJson
): DockerNetwork => ({
  id: json.ID,
  createdAt: new Date(json.CreatedAt),
  driver: json.Driver,
  ipv6: json.IPv6 === 'true',
  internal: json.Internal === 'true',
  labels: json.Labels,
  name: json.Name,
  scope: json.Scope,
});
