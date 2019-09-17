import { Component } from '@angular/core';
import { NavbarTopics } from '../../../core/core.module';

@Component({
	selector: 'app-grid',
	templateUrl: './grid.component.html',
	styleUrls: ['./grid.component.scss']
})
export class GridComponent {
}


NavbarTopics.registerTopic({
	id: 'grid',
	title: 'Grid',
	ordinal: 4,
	path: 'grid',
	iconClass: 'fa-th',
	hasSomeRoles: ['user']
});
