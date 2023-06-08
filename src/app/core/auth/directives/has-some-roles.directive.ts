import { NgIf } from '@angular/common';
import { Directive, Input, OnInit, inject } from '@angular/core';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { AuthorizationService } from '../authorization.service';
import { Role } from '../role.model';
import { SessionService } from '../session.service';

@UntilDestroy()
@Directive({
	selector: '[hasSomeRoles]',
	hostDirectives: [
		{
			directive: NgIf,
			inputs: ['ngIfElse: hasSomeRolesElse', 'ngIfThen: hasSomeRolesThen']
		}
	]
})
export class HasSomeRolesDirective implements OnInit {
	roles: Array<string | Role>;
	andCondition = true;
	orCondition = false;

	private ngIfDirective = inject(NgIf);
	private sessionService = inject(SessionService);
	private authorizationService = inject(AuthorizationService);

	@Input()
	set hasSomeRoles(roles: Array<string | Role>) {
		this.roles = roles;
		this.updateNgIf();
	}

	@Input()
	set hasSomeRolesAnd(condition: boolean) {
		this.andCondition = condition;
		this.updateNgIf();
	}

	@Input()
	set hasSomeRolesOr(condition: boolean) {
		this.orCondition = condition;
		this.updateNgIf();
	}

	ngOnInit() {
		this.sessionService
			.getSession()
			.pipe(untilDestroyed(this))
			.subscribe(() => {
				this.updateNgIf();
			});
	}

	private updateNgIf() {
		this.ngIfDirective.ngIf =
			this.orCondition ||
			(this.andCondition && this.authorizationService.hasSomeRoles(this.roles));
	}
}
