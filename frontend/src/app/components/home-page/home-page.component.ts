import { WatcherService } from './../../services/watcher.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit {
  get watchListArr() {
    return Object.values(this.watcher.watchList);
  }
  constructor(private watcher: WatcherService) {}

  ngOnInit(): void {}
}
