import { Component } from '@angular/core';

import { NavbarTopics } from '../../../core/site-navbar/navbar-topic.model';

import { of } from 'rxjs';
import { delay, first } from 'rxjs/operators';

@Component({
	selector: 'app-forms',
	templateUrl: './forms.component.html'
})
export class FormsComponent {
	log($event) {
		console.log($event);
	}

	fileSelected($event) {
		$event.target.parentElement.setAttribute('data-after', $event.target.files[0].name);
	}

	submit($event) {
		const btn = $event.target;
		btn.disabled = true;
		btn.classList.add('btn-submitting');

		// Simulate component submitting w/ delay
		of(true)
			.pipe(delay(4000), first())
			.subscribe(() => {
				btn.disabled = false;
				btn.classList.remove('btn-submitting');
			});
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
