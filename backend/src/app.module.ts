import { Module } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { AppService } from './app.service';
import { WatcherGateway } from './controllers/watcher.gateway';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, WatcherGateway],
})
export class AppModule {}
