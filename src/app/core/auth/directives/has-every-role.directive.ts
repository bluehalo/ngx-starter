import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { AbstractIfThenElseDirective } from '../../../common/directives/abstract-if-then-else.directive';
import { AuthorizationService } from '../authorization.service';
import { Role } from '../role.model';
import { SessionService } from '../session.service';

@UntilDestroy()
@Directive({
	selector: '[hasEveryRole]'
})
export class HasEveryRoleDirective extends AbstractIfThenElseDirective implements OnInit {
	roles: Array<string | Role>;
	constructor(
		templateRef: TemplateRef<any>,
		private sessionService: SessionService,
		private authorizationService: AuthorizationService
	) {
		super(templateRef);
	}

	@Input()
	set hasEveryRole(roles: Array<string | Role>) {
		this.roles = roles;
		this._updateView();
	}

	@Input()
	set hasEveryRoleThen(templateRef: TemplateRef<any> | null) {
		this.setThenTemplate('hasEveryRoleThen', templateRef);
	}

	@Input()
	set hasEveryRoleElse(templateRef: TemplateRef<any> | null) {
		this.setElseTemplate('hasEveryRoleElse', templateRef);
	}

	@Input()
	set hasEveryRoleAnd(condition: boolean) {
		this._andCondition = condition;
		this._updateView();
	}

	@Input()
	set hasEveryRoleOr(condition: boolean) {
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
		return this.authorizationService.hasEveryRole(this.roles);
	}
}
