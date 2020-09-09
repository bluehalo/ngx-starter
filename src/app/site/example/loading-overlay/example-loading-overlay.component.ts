import { Component } from '@angular/core';

import { NavbarTopics } from '../../../core/site-navbar/navbar-topic.model';

@Component({
	selector: 'example-loading-overlay',
	template: `
		<div class="container-fluid">
			<div class="row">
				<div class="col">
					<h1>Loading Overlay</h1>
					<div style="border: dashed black; position: relative">
						<loading-overlay
							[isLoading]="isLoading"
							[isError]="isError"
							[errorMessage]="errorMessage"
							(retry)="handleRetry()"
						></loading-overlay>
						<p>This is the where the loaded content will go</p>
						<br />
						<br />
					</div>
				</div>
			</div>

			<br />
			<div class="btn-group">
				<button class="btn btn-primary" (click)="toggleLoading()" [disabled]="isError">
					{{ isLoading ? 'Stop' : 'Start' }} Loading
				</button>
				<button class="btn btn-primary ml-3" (click)="toggleError()">
					{{ isError ? 'Hide' : 'Show' }} Error
				</button>
			</div>
		</div>
	`
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
