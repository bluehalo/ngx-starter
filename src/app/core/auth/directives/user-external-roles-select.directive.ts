import { DestroyRef, Directive, OnInit, SimpleChange, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { NgSelectComponent } from '@ng-select/ng-select';
import { map } from 'rxjs/operators';

import { isNotNullOrUndefined } from '../../../common/rxjs-utils';
import { SessionService } from '../session.service';

@Directive({
	selector: 'ng-select[appUserExternalRolesSelect]',
	standalone: true
})
export class UserExternalRolesSelectDirective implements OnInit {
	private destroyRef = inject(DestroyRef);
	private select = inject(NgSelectComponent);
	private sessionService = inject(SessionService);

	ngOnInit() {
		this.select.items = [];
		this.sessionService
			.getSession()
			.pipe(
				isNotNullOrUndefined(),
				map((session) => session.user.userModel.externalRoles),
				takeUntilDestroyed(this.destroyRef)
			)
			.subscribe((externalRoles) => {
				const change = new SimpleChange(this.select.items, externalRoles, false);
				this.select.items = externalRoles;
				// change detection doesn't work properly when setting input programmatically
				// tslint:disable-next-line:no-lifecycle-call
				this.select.ngOnChanges({ items: change });
			});
	}
}
