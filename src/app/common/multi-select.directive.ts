import {
	DestroyRef,
	Directive,
	OnInit,
	SimpleChange,
	booleanAttribute,
	inject,
	input
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { NgSelectComponent } from '@ng-select/ng-select';

@Directive({
	selector: 'ng-select[multi-select]',
	standalone: true,
	// eslint-disable-next-line @angular-eslint/no-host-metadata-property
	host: {
		['class.ng-hide-arrow-wrapper']: 'hideArrow()'
	}
})
export class MultiSelectDirective implements OnInit {
	readonly #select = inject(NgSelectComponent);
	readonly #destroyRef = inject(DestroyRef);

	readonly hideArrow = input(true, { transform: booleanAttribute });

	ngOnInit() {
		this.#select.addTag = true;
		this.#select.hideSelected = true;
		this.#select.multiple = true;
		this.updateIsOpen(false);

		// change detection doesn't work properly when setting items programmatically
		// tslint:disable-next-line:no-lifecycle-call
		this.#select.ngOnChanges({
			items: new SimpleChange([], [], true)
		});

		this.#select.addEvent.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe(() => {
			this.updateIsOpen(false);
		});
		this.#select.searchEvent.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe((event) => {
			const isOpen = event.term.trim().length > 0;
			this.updateIsOpen(isOpen);
		});
		// Clear the items on clear event.  Fixes bug where cleared items are suggested as options.
		this.#select.clearEvent.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe(() => {
			this.#select.itemsList.setItems([]);
		});
	}

	private updateIsOpen(isOpen: boolean) {
		// change detection doesn't work properly when setting input programmatically
		// tslint:disable-next-line:no-lifecycle-call
		const change = new SimpleChange(this.#select.isOpen, isOpen, false);
		this.#select.isOpen = isOpen;
		this.#select.ngOnChanges({ isOpen: change });
	}
}
