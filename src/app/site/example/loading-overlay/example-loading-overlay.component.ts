import { Component } from '@angular/core';

import { LoadingOverlayComponent } from '../../../common/loading-overlay/loading-overlay.component';
import { NavbarTopics } from '../../../core/site-navbar/navbar-topic.model';

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
NavbarTopics.registerTopic({
	id: 'loading-overlay',
	title: 'Loading Overlay',
	ordinal: 6,
	path: 'loading-overlay',
	iconClass: 'fa-spinner',
	hasSomeRoles: ['user']
});
