import { Component } from '@angular/core';
import { NavbarTopics } from '../../../core/site-navbar/navbar-topic.model';

@Component({
	selector: 'app-forms',
	templateUrl: './forms.component.html'
})
export class FormsComponent {
	log($event) {
		console.log($event);
	}
}


NavbarTopics.registerTopic({
	id: 'forms',
	title: 'Forms',
	ordinal: 3,
	path: 'forms',
	iconClass: 'fa-check-square-o',
	hasSomeRoles: ['user']
});
