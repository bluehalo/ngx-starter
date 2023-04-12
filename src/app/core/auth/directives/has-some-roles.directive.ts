import { Directive, Input, OnInit, TemplateRef, inject } from '@angular/core';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { AbstractIfThenElseDirective } from '../../../common/directives/abstract-if-then-else.directive';
import { AuthorizationService } from '../authorization.service';
import { Role } from '../role.model';
import { SessionService } from '../session.service';

@UntilDestroy()
@Directive({
	selector: '[hasSomeRoles]'
})
export class HasSomeRolesDirective extends AbstractIfThenElseDirective implements OnInit {
	roles: Array<string | Role>;

	private sessionService = inject(SessionService);
	private authorizationService = inject(AuthorizationService);

	@Input()
	set hasSomeRoles(roles: Array<string | Role>) {
		this.roles = roles;
		this._updateView();
	}

	@Input()
	set hasSomeRolesThen(templateRef: TemplateRef<any> | null) {
		this.setThenTemplate('hasSomeRolesThen', templateRef);
	}

	@Input()
	set hasSomeRolesElse(templateRef: TemplateRef<any> | null) {
		this.setElseTemplate('hasSomeRolesElse', templateRef);
	}
	@Input()
	set hasSomeRolesAnd(condition: boolean) {
		this._andCondition = condition;
		this._updateView();
	}

	@Input()
	set hasSomeRolesOr(condition: boolean) {
		this._orCondition = condition;
		this._updateView();
	}

	ngOnInit() {
		this.sessionService
			.getSession()
			.pipe(untilDestroyed(this))
			.subscribe(() => {
				this._updateView();
			});
	}

	protected checkPermission(): boolean {
		return this.authorizationService.hasSomeRoles(this.roles);
	}
}
