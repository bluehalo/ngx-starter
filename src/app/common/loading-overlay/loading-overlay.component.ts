import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
	selector: 'loading-overlay',
	templateUrl: 'loading-overlay.component.html',
	styleUrls: ['loading-overlay.component.scss']
})
export class LoadingOverlayComponent {
	@Input() message = 'Loading...';
	@Input() isLoading = false;
	@Input() isError = false;
	@Input() errorMessage = '';

	@Output() readonly retry = new EventEmitter();

	handleRetry() {
		this.retry.emit(true);
	}
}
