import { NgIf } from '@angular/common';
import { DestroyRef, Directive, Input, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { AuthorizationService } from '../authorization.service';
import { Role } from '../role.model';
import { SessionService } from '../session.service';

@Directive({
	selector: '[hasEveryRole]',
	hostDirectives: [
		{
			directive: NgIf,
			inputs: ['ngIfElse: hasEveryRoleElse', 'ngIfThen: hasEveryRoleThen']
		}
	],
	standalone: true
})
export class HasEveryRoleDirective implements OnInit {
	roles: Array<string | Role>;
	andCondition = true;
	orCondition = false;

	private destroyRef = inject(DestroyRef);
	private ngIfDirective = inject(NgIf);
	private sessionService = inject(SessionService);
	private authorizationService = inject(AuthorizationService);

	@Input({ required: true })
	set hasEveryRole(roles: Array<string | Role>) {
		this.roles = roles;
		this.updateNgIf();
	}

	@Input()
	set hasEveryRoleAnd(condition: boolean) {
		this.andCondition = condition;
		this.updateNgIf();
	}

	@Input()
	set hasEveryRoleOr(condition: boolean) {
		this.orCondition = condition;
		this.updateNgIf();
	}

	ngOnInit() {
		this.sessionService
			.getSession()
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe(() => {
				this.updateNgIf();
			});
	}

	private updateNgIf() {
		this.ngIfDirective.ngIf =
			this.orCondition ||
			(this.andCondition && this.authorizationService.hasEveryRole(this.roles));
	}
}
