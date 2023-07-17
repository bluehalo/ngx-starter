import { Component } from '@angular/core';

import { NavbarTopics } from '../../../core/site-navbar/navbar-topic.model';

@Component({
	selector: 'app-grid',
	templateUrl: './grid.component.html',
	styleUrls: ['./grid.component.scss'],
	standalone: true
})
export class GridComponent {}

NavbarTopics.registerTopic({
	id: 'grid',
	title: 'Grid',
	ordinal: 4,
	path: 'grid',
	iconClass: 'fa-th',
	hasSomeRoles: ['user']
});
