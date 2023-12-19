import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { NgIf } from '@angular/common';
import { DestroyRef, Directive, Input, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { AuthorizationService } from '../authorization.service';
import { SessionService } from '../session.service';

@Directive({
	selector: '[isAuthenticated]',
	hostDirectives: [
		{
			directive: NgIf,
			inputs: ['ngIfElse: isAuthenticatedElse', 'ngIfThen: isAuthenticatedThen']
		}
	],
	standalone: true
})
export class IsAuthenticatedDirective implements OnInit {
	private _isAuthenticated = true;
	andCondition = true;
	orCondition = false;

	private destroyRef = inject(DestroyRef);
	private ngIfDirective = inject(NgIf);
	private sessionService = inject(SessionService);
	private authorizationService = inject(AuthorizationService);

	@Input()
	set isAuthenticated(isAuthenticated: BooleanInput) {
		this._isAuthenticated = coerceBooleanProperty(isAuthenticated);
		this.updateNgIf();
	}

	@Input()
	set isAuthenticatedAnd(condition: boolean) {
		this.andCondition = condition;
		this.updateNgIf();
	}

	@Input()
	set isAuthenticatedOr(condition: boolean) {
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
			this.orCondition || (this.andCondition && this.authorizationService.isAuthenticated());
	}
}
