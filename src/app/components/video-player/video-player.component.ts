import { AfterViewInit, Component, ElementRef, input, OnDestroy, ViewChild } from '@angular/core';

import Artplayer from 'artplayer';

@Component({
	selector: 'app-video-player',
	imports: [],
	templateUrl: './video-player.component.html',
	styleUrl: './video-player.component.css',
})
export class VideoPlayerComponent implements AfterViewInit, OnDestroy {

	@ViewChild('playerContainer', { static: true }) playerContainer!: ElementRef;

	private art: Artplayer | null = null;

	readonly url = input.required<string>();

	ngAfterViewInit(): void {
		this.art = new Artplayer({
			container: this.playerContainer.nativeElement,
			url: this.url(),
			// poster: this.poster,
			volume: 0.1,
			isLive: false,
			muted: false,
			autoplay: false,
			pip: true,
			autoSize: true,
			autoMini: true,
			screenshot: true,
			setting: true,
			loop: false,
			flip: true,
			playbackRate: true,
			aspectRatio: true,
			fullscreen: true,
			fullscreenWeb: true,
			subtitleOffset: true,
			miniProgressBar: true,
			mutex: true,
			backdrop: true,
			playsInline: true,
			autoPlayback: true,
			airplay: true,
			theme: '#009999',
		});
	}

	ngOnDestroy(): void {
		if (this.art) {
			this.art.destroy(false);
		}
	}
}