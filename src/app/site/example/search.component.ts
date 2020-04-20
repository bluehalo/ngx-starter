import { Component } from '@angular/core';

import { NavbarTopics } from '../../core/core.module';

@Component({
	template: `
		<div class="container">
			<div class="row">
				<div class="col">
					<h1>Search Page</h1>
					<p>Simple demonstration of routing.</p>
				</div>
			</div>
		</div>
	`,
	styles: ['']
})
export class SearchComponent {}

NavbarTopics.registerTopic({
	id: 'search',
	title: 'Search',
	ordinal: 2,
	path: 'search',
	iconClass: 'fa-search',
	hasSomeRoles: ['user']
});
