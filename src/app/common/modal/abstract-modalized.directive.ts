import { Directive } from '@angular/core';

import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';
import { BehaviorSubject, Subject } from 'rxjs';

/**
 * The AbstractModalizedDirective is meant to make any component that extends it 'modalized.' Modalized components
 * can be used with the ContainerModalComponent.
 */
@UntilDestroy()
@Directive()
export abstract class AbstractModalizedDirective {
	/**
	 * The ContainerModalComponent will call '.next()' on this subject when the modal's 'ok' button is pressed
	 */
	okSubject: Subject<void> = new Subject<void>();

	/**
	 * The ContainerModalComponent will call '.next()' on this subject when the modal's 'cancel' button is pressed
	 */
	cancelSubject: Subject<void> = new Subject<void>();

	/**
	 * If there is any kind of validation being performed in the modalized component, the component can call '.next()'
	 * on this subject to indicate to the ContainerModalComponent whether or not the 'ok' button should be active.\
	 */
	disableOkSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

	constructor() {
		this.okSubject.pipe(untilDestroyed(this)).subscribe({
			next: () => {
				this.onOk();
			},
			error: err => {
				console.error(err);
			}
		});

		this.cancelSubject.pipe(untilDestroyed(this)).subscribe({
			next: () => {
				this.onCancel();
			},
			error: err => {
				console.error(err);
			}
		});
	}

	/**
	 * Actions to perform when the modal's 'ok' button is pressed
	 */
	abstract onOk(): any;

	/**
	 * Actions to perform when the modal's 'cancel' button is pressed
	 */
	abstract onCancel(): any;
}
