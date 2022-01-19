import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { AbstractIfThenElseDirective } from '../../../common/directives/abstract-if-then-else.directive';
import { AuthorizationService } from '../authorization.service';
import { SessionService } from '../session.service';

@UntilDestroy()
@Directive({
	selector: '[isAuthenticated]'
})
export class IsAuthenticatedDirective extends AbstractIfThenElseDirective implements OnInit {
	private _isAuthenticated = true;

	constructor(
		viewContainer: ViewContainerRef,
		templateRef: TemplateRef<any>,
		private sessionService: SessionService,
		private authorizationService: AuthorizationService
	) {
		super(viewContainer, templateRef);
	}

	@Input()
	set isAuthenticated(isAuthenticated: BooleanInput) {
		this._isAuthenticated = coerceBooleanProperty(isAuthenticated);
		this._updateView();
	}

	@Input()
	set isAuthenticatedThen(templateRef: TemplateRef<any> | null) {
		this.setThenTemplate('isAuthenticatedThen', templateRef);
	}

	@Input()
	set isAuthenticatedElse(templateRef: TemplateRef<any> | null) {
		this.setElseTemplate('isAuthenticatedElse', templateRef);
	}

	@Input()
	set isAuthenticatedAnd(condition: boolean) {
		this._andCondition = condition;
		this._updateView();
	}

	@Input()
	set isAuthenticatedOr(condition: boolean) {
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
		return this.authorizationService.isAuthenticated() === this._isAuthenticated;
	}
}
