import { animate, style, transition, trigger } from '@angular/animations';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { SiteContainerComponent } from './core/site-container/site-container.component';
import { ThemingService } from './core/theming/theming.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	standalone: true,
	imports: [SiteContainerComponent, RouterOutlet],
	animations: [
		trigger('enter', [
			transition(':enter', [
				style({ opacity: 0 }),
				animate('200ms ease-in', style({ opacity: 1 }))
			])
		])
	]
})
export class AppComponent {
	private theming = inject(ThemingService);
}
