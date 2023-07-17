import { Component } from '@angular/core';

import { LoadingOverlayComponent } from '../../../common/loading-overlay/loading-overlay.component';

@Component({
	selector: 'example-loading-overlay',
	templateUrl: './example-loading-overlay.component.html',
	standalone: true,
	imports: [LoadingOverlayComponent]
})
export class ExampleLoadingOverlayComponent {
	isLoading = true;
	isError = false;
	errorMessage = 'This is an example error message';

	handleRetry() {
		this.isError = false;
		this.isLoading = true;
	}

	toggleLoading() {
		this.isLoading = !this.isLoading;
	}

	toggleError() {
		this.isError = !this.isError;
	}
}
