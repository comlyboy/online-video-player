import { Component } from '@angular/core';

import { VideoPlayerComponent } from '../../components/video-player/video-player.component';

@Component({
  selector: 'app-play',
  imports: [VideoPlayerComponent],
  templateUrl: './play.component.html',
  styleUrl: './play.component.css',
})
export class PlayComponent {}
