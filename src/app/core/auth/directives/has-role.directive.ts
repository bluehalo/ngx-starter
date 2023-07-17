import { NgIf } from '@angular/common';
import { Directive, Input, OnInit, inject } from '@angular/core';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { AuthorizationService } from '../authorization.service';
import { Role } from '../role.model';
import { SessionService } from '../session.service';

@UntilDestroy()
@Directive({
	selector: '[hasRole]',
	hostDirectives: [
		{
			directive: NgIf,
			inputs: ['ngIfElse: hasRoleElse', 'ngIfThen: hasRoleThen']
		}
	],
	standalone: true
})
export class HasRoleDirective implements OnInit {
	role: string | Role;
	andCondition = true;
	orCondition = false;

	private ngIfDirective = inject(NgIf);
	private sessionService = inject(SessionService);
	private authorizationService = inject(AuthorizationService);

	@Input()
	set hasRole(role: string | Role) {
		this.role = role;
		this.updateNgIf();
	}

	@Input()
	set hasRoleAnd(condition: boolean) {
		this.andCondition = condition;
		this.updateNgIf();
	}

	@Input()
	set hasRoleOr(condition: boolean) {
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
			this.orCondition || (this.andCondition && this.authorizationService.hasRole(this.role));
	}
}
