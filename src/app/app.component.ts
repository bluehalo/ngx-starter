import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { SiteContainerComponent } from './core/site-container/site-container.component';
import { ThemingService } from './core/theming/theming.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	standalone: true,
	imports: [SiteContainerComponent, RouterOutlet]
})
export class AppComponent {
	private theming = inject(ThemingService);
}
