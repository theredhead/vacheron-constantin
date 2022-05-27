import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import * as ping from 'ping';

const TIME_BETWEEN_PINGS = 10000;

const hosts: string[] = [
  '127.0.0.1',
  'google.com',
  'wikipedia.com',
  'apple.com',
  'apple.nl',
  'apple.de',
];

@WebSocketGateway({ cors: true })
export class WatcherGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  private server: Server;
  private readonly logger: Logger = new Logger('WatcherGateway');
  private readonly hostsToProbe = hosts;
  private numberOfConnectedClients = 0;

  afterInit(server: Server) {
    this.logger.log('WatcherGateway.afterInit');
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.numberOfConnectedClients++;
    this.logger.log(
      `connected: ${client.id} (${this.numberOfConnectedClients})`,
    );

    if (this.numberOfConnectedClients === 1) {
      for (const host of this.hostsToProbe) {
        this.startProbing(host);
      }
    }
  }
  handleDisconnect(client: Socket) {
    this.numberOfConnectedClients--;
    this.logger.log(`disconnected: ${client.id}`);
  }

  updateAllClients() {
    this.logger.log(`updateAllClients: ${this.numberOfConnectedClients}`);

    this.server.emit('update', {
      data: new Date(),
    });
  }

  startProbing(host: string) {
    this.probe(host);
  }

  probe(host: string) {
    if (this.numberOfConnectedClients > 0) {
      ping.promise
        .probe(host)
        .then((result) => {
          this.logger.log(`ping response from ${host}`);
          this.server.emit('probe-result', {
            timestamp: new Date(),
            host: host,
            result: result,
          });

          setTimeout(() => {
            this.probe(host);
          }, TIME_BETWEEN_PINGS);
        })
        .catch((error) => {
          this.logger.log(`error probing ${host}`);
          this.server.emit('probe-result', {
            timestamp: new Date(),
            host: host,
            result: error,
          });

          setTimeout(() => {
            this.probe(host);
          }, TIME_BETWEEN_PINGS);
        });
    }
  }
}
