import { Directive, OnInit, SimpleChange, inject } from '@angular/core';

import { NgSelectComponent } from '@ng-select/ng-select';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { map } from 'rxjs/operators';

import { isNotNullOrUndefined } from '../../../common/rxjs-utils';
import { SessionService } from '../session.service';

@UntilDestroy()
@Directive({
	selector: 'ng-select[appUserExternalRolesSelect]',
	standalone: true
})
export class UserExternalRolesSelectDirective implements OnInit {
	private select = inject(NgSelectComponent);
	private sessionService = inject(SessionService);

	ngOnInit() {
		this.select.items = [];
		this.sessionService
			.getSession()
			.pipe(
				isNotNullOrUndefined(),
				map((session) => session.user.userModel.externalRoles),
				untilDestroyed(this)
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
