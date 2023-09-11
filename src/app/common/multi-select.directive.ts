import { Directive, HostBinding, Input, OnInit, SimpleChange, inject } from '@angular/core';

import { NgSelectComponent } from '@ng-select/ng-select';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Directive({
	selector: 'ng-select[multi-select]',
	standalone: true
})
export class MultiSelectDirective implements OnInit {
	private select = inject(NgSelectComponent);

	@Input()
	@HostBinding('class.ng-hide-arrow-wrapper')
	hideArrow = true;

	ngOnInit() {
		this.select.addTag = true;
		this.select.hideSelected = true;
		this.select.multiple = true;
		this.updateIsOpen(false);

		this.select.addEvent.pipe(untilDestroyed(this)).subscribe(() => {
			this.updateIsOpen(false);
		});
		this.select.searchEvent.pipe(untilDestroyed(this)).subscribe((event) => {
			const isOpen = event.term.trim().length > 0;
			this.updateIsOpen(isOpen);
		});
	}

	private updateIsOpen(isOpen: boolean) {
		// change detection doesn't work properly when setting input programmatically
		// tslint:disable-next-line:no-lifecycle-call
		const change = new SimpleChange(this.select.isOpen, isOpen, false);
		this.select.isOpen = isOpen;
		this.select.ngOnChanges({ isOpen: change });
	}
}
