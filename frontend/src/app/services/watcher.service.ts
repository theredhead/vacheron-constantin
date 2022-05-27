import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';

const endpoint = 'ws://localhost:3000/';

@Injectable({
  providedIn: 'root',
})
export class WatcherService {
  readonly server: Socket;
  readonly watchList: { [key: string]: ProbeResult } = {};

  constructor() {
    this.server = io(endpoint);
    this.server.on('probe-result', (data: any) =>
      this.onProbeResult(<ProbeResult>data)
    );
  }

  onProbeResult(result: ProbeResult): void {
    this.watchList[result.host] = result;
  }
}

interface ProbeResult {
  timestamp: string;
  host: string;
  result: {
    inputHost: string;
    host: string;
    alive: true;
    output: string;
    time: number;
    times: number[];
    min: string;
    max: string;
    avg: string;
    stddev: string;
    packetLoss: string;
    numeric_host: string;
  };
}
