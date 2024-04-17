import { Component, EventEmitter, Input, Output } from '@angular/core';

import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';
import { NotificationComponent } from '../notification/notification.component';

@Component({
	selector: 'loading-overlay',
	templateUrl: 'loading-overlay.component.html',
	styleUrls: ['loading-overlay.component.scss'],
	standalone: true,
	imports: [NotificationComponent, LoadingSpinnerComponent]
})
export class LoadingOverlayComponent {
	@Input()
	message = 'Loading...';

	@Input()
	isLoading = false;

	@Input()
	isError = false;

	@Input()
	errorMessage = '';

	@Output()
	readonly retry = new EventEmitter();

	handleRetry() {
		this.retry.emit(true);
	}
}
