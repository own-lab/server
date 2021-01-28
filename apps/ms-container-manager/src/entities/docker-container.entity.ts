export type State = 'running' | 'exited';
export type Protocol = 'tcp' | 'udp';

export interface DockerContainer {
  id: string;
  createdAt: Date;
  state: State;
  name: string;
  ports: {
    host: number;
    container: number;
    protocol: Protocol;
  }[];
}
