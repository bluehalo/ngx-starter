import { Directive } from '@angular/core';

import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';
import { BehaviorSubject, Subject } from 'rxjs';

/**
 * The AbstractModalizableDirective is meant to make any component that extends it 'modalizable.' Modalizable components
 * can be used with the ModalService's showContainerModal to create custom modals.
 *
 * Components extending the AbstractModalizableDirective that need to auto-focus a particular element when the modal is
 * opened should add a cdkFocusInitial attribute to the element to be focused.
 */
@UntilDestroy()
@Directive()
export abstract class AbstractModalizableDirective {
	isModal = false;

	/**
	 * The ContainerModalComponent will call '.next()' on this subject when the modal's 'ok' button is pressed
	 */
	/* eslint-disable-next-line rxjs/finnish */
	okSubject = new Subject<void>();

	/**
	 * The ContainerModalComponent will call '.next()' on this subject when the modal's 'cancel' button is pressed
	 */
	/* eslint-disable-next-line rxjs/finnish */
	cancelSubject = new Subject<void>();

	/**
	 * If there is any kind of validation being performed in the modalized component, the component can call '.next()'
	 * on this subject to indicate to the ContainerModalComponent whether or not the 'ok' button should be active.\
	 */
	/* eslint-disable-next-line rxjs/finnish */
	disableOkSubject = new BehaviorSubject<boolean>(false);

	constructor() {
		this.okSubject.pipe(untilDestroyed(this)).subscribe({
			next: () => {
				this.onOk();
			},
			error: (err: unknown) => {
				console.error(err);
			}
		});

		this.cancelSubject.pipe(untilDestroyed(this)).subscribe({
			next: () => {
				this.onCancel();
			},
			error: (err: unknown) => {
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
