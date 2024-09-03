import { bootstrapApplication } from '@angular/platform-browser';

import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

bootstrapApplication(AppComponent, appConfig).catch((err) => {
	const messageEl = document.querySelector('app-root .message');
	if (messageEl) {
		messageEl.textContent = err.message;
	}
});
