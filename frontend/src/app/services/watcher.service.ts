import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';

const endpoint = 'ws://localhost:3000/';

@Injectable({
  providedIn: 'root',
})
export class WatcherService {
  readonly server: Socket;

  constructor() {
    this.server = io(endpoint);
    this.server.on('update', (data: any) => this.update(data));
  }
  update(data: any): void {
    console.log('update:', data);
  }
}
