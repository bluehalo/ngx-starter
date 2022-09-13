import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { AbstractIfThenElseDirective } from '../../../common/directives/abstract-if-then-else.directive';
import { AuthorizationService } from '../authorization.service';
import { Role } from '../role.model';
import { SessionService } from '../session.service';

@UntilDestroy()
@Directive({
	selector: '[hasRole]'
})
export class HasRoleDirective extends AbstractIfThenElseDirective implements OnInit {
	role: string | Role;
	constructor(
		templateRef: TemplateRef<any>,
		private sessionService: SessionService,
		private authorizationService: AuthorizationService
	) {
		super(templateRef);
	}

	@Input()
	set hasRole(role: string | Role) {
		this.role = role;
		this._updateView();
	}

	@Input()
	set hasRoleThen(templateRef: TemplateRef<any> | null) {
		this.setThenTemplate('hasRoleThen', templateRef);
	}

	@Input()
	set hasRoleElse(templateRef: TemplateRef<any> | null) {
		this.setElseTemplate('hasRoleElse', templateRef);
	}

	@Input()
	set hasRoleAnd(condition: boolean) {
		this._andCondition = condition;
		this._updateView();
	}

	@Input()
	set hasRoleOr(condition: boolean) {
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
		return this.authorizationService.hasRole(this.role);
	}
}
