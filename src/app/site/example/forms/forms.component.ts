import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';

import { NgSelectModule } from '@ng-select/ng-select';
import { of } from 'rxjs';
import { delay, first } from 'rxjs/operators';

@Component({
	selector: 'app-forms',
	templateUrl: './forms.component.html',
	standalone: true,
	imports: [FormsModule, NgSelectModule]
})
export class FormsComponent {
	private destroyRef = inject(DestroyRef);

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
			.pipe(delay(4000), first(), takeUntilDestroyed(this.destroyRef))
			.subscribe(() => {
				btn.disabled = false;
				btn.classList.remove('btn-submitting');
			});
	}
}
