import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

@WebSocketGateway({ cors: true })
export class WatcherGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  private server: Server;

  private readonly logger: Logger = new Logger('WatcherGateway');

  afterInit(server: Server) {
    this.logger.log('WatcherGateway.afterInit');
    setInterval(() => {
      this.updateAllClients();
    }, 10000);
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`connected: ${client.id}`);
  }
  handleDisconnect(client: Socket) {
    this.logger.log(`disconnected: ${client.id}`);
  }

  updateAllClients() {
    this.logger.log(`updateAllClients: ${this.server.allSockets.length}`);

    this.server.emit('update', {
      data: new Date(),
    });
  }

  @SubscribeMessage('msgToServer')
  handleIncomingMessage(client: Socket, payload: any): WsResponse<string> {
    this.logger.log(client, payload);
    return {
      event: 'msToClient',
      data: 'Hello, World!',
    };
  }
}
