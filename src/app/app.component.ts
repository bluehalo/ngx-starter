import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { SiteContainerComponent } from './core/site-container/site-container.component';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	standalone: true,
	imports: [SiteContainerComponent, RouterOutlet]
})
export class AppComponent {}
