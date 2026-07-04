import { Route, Routes } from '@angular/router';

export const routes: Route[] = [
	{
		path: 'home',
		loadComponent: () => import('./pages/home/home.component')
			.then(m => m.HomeComponent)
	},
	{
		path: '',
		loadComponent: () => import('.//pages/play/play.component').then(c => c.PlayComponent)
	}
];
