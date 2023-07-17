import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NgSelectModule } from '@ng-select/ng-select';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { of } from 'rxjs';
import { delay, first } from 'rxjs/operators';

import { NavbarTopics } from '../../../core/site-navbar/navbar-topic.model';

@UntilDestroy()
@Component({
	selector: 'app-forms',
	templateUrl: './forms.component.html',
	standalone: true,
	imports: [FormsModule, NgSelectModule]
})
export class FormsComponent {
	fileSelected($event: Event) {
		const target = $event.target as HTMLInputElement;
		target.parentElement?.setAttribute('data-after', target?.files?.[0]?.name ?? '');
	}

	submit($event: Event) {
		const btn = $event.target as HTMLButtonElement;
		btn.disabled = true;
		btn.classList.add('btn-submitting');

		// Simulate component submitting w/ delay
		of(true)
			.pipe(delay(4000), first(), untilDestroyed(this))
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
	iconClass: 'fa-check-square',
	hasSomeRoles: ['user']
});
