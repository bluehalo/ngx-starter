import { DestroyRef, Directive, OnInit, SimpleChange, inject } from '@angular/core';

import { NgSelectComponent } from '@ng-select/ng-select';

import { APP_SESSION } from '../../tokens';

@Directive({
	selector: 'ng-select[appUserExternalRolesSelect]',
	standalone: true
})
export class UserExternalRolesSelectDirective implements OnInit {
	private destroyRef = inject(DestroyRef);
	private select = inject(NgSelectComponent);
	#session = inject(APP_SESSION);

	ngOnInit() {
		const externalRoles = this.#session().user?.externalRoles ?? [];

		const change = new SimpleChange(this.select.items, externalRoles, false);
		this.select.items = externalRoles;
		// change detection doesn't work properly when setting input programmatically
		// tslint:disable-next-line:no-lifecycle-call
		this.select.ngOnChanges({ items: change });
	}
}
