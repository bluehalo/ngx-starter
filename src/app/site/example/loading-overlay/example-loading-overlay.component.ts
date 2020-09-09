import { Component } from '@angular/core';

import { NavbarTopics } from '../../../core/site-navbar/navbar-topic.model';

@Component({
	selector: 'example-loading-overlay',
	template: `
		<div class="container-fluid">
			<div class="row">
				<div class="col">
					<h1>Loading Overlay</h1>
					<div style="border: solid black">
						<loading-overlay [isLoading]="isLoading"></loading-overlay>
						<p>This is the where the loaded content will go</p>
						<p *ngIf="!isLoading">This is the loaded content</p>
					</div>
				</div>
			</div>

			<br />
			<div class="row">
				<button>Stop Loading</button>
				<button>Start Loading</button>
				<button>Show Error</button>
			</div>
		</div>
	`
})
export class ExampleLoadingOverlayComponent {
	isLoading = true;
}
NavbarTopics.registerTopic({
	id: 'loading-overlay',
	title: 'Loading Overlay',
	ordinal: 6,
	path: 'loading-overlay',
	iconClass: 'fa-spinner',
	hasSomeRoles: ['user']
});
