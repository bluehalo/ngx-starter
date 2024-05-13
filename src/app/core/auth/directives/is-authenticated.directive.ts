import { NgIf } from '@angular/common';
import {
	Directive,
	Injector,
	OnInit,
	booleanAttribute,
	effect,
	inject,
	input
} from '@angular/core';

import { APP_SESSION } from '../../tokens';

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
	readonly #ngIfDirective = inject(NgIf);
	readonly #injector = inject(Injector);
	readonly #session = inject(APP_SESSION);

	readonly isAuthenticated = input(true, { transform: booleanAttribute });
	readonly andCondition = input(true, { alias: 'isAuthenticatedAnd' });
	readonly orCondition = input(false, { alias: 'isAuthenticatedOr' });

	ngOnInit() {
		effect(
			() => {
				this.updateNgIf();
			},
			{ injector: this.#injector }
		);
	}

	private updateNgIf() {
		this.#ngIfDirective.ngIf =
			this.orCondition() || (this.andCondition() && this.#session().isAuthenticated());
	}
}
