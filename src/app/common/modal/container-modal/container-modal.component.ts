import {
	AfterContentChecked,
	AfterViewInit,
	Component,
	ComponentFactoryResolver,
	Type,
	ViewChild,
	ViewContainerRef
} from '@angular/core';

import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';

import { AbstractModalDirective } from '../abstract-modal.directive';
import { AbstractModalizableDirective } from '../abstract-modalizable.directive';

@UntilDestroy()
@Component({
	templateUrl: 'container-modal.component.html',
	styleUrls: ['container-modal.component.scss']
})
export class ContainerModalComponent
	extends AbstractModalDirective
	implements AfterViewInit, AfterContentChecked
{
	@ViewChild('modalizableComponentContainer', { read: ViewContainerRef })
	modalizableComponentContainer: ViewContainerRef;

	modalizableComponent: Type<AbstractModalizableDirective>;

	modalizableComponentProperties: { [key: string]: any } = {};

	okSubject: Subject<void>;

	cancelSubject: Subject<void>;

	isOkDisabled = false;

	isCdkFocusInitial = false;

	constructor(public modalRef: BsModalRef) {
		super(modalRef);
	}

	ngAfterViewInit(): void {
		// Add the supplied modalized component to the content container
		this.modalizableComponentContainer.clear();
		const componentRef = this.modalizableComponentContainer.createComponent(
			this.modalizableComponent
		);

		// Set any supplied component properties
		Object.entries(this.modalizableComponentProperties).forEach(([key, value]) => {
			Object.defineProperty(componentRef.instance, key, {
				value,
				writable: true
			});
		});

		// Make the component aware that it is a modal
		componentRef.instance.isModal = true;

		// References to the modalized component's ok/cancel subjects
		this.okSubject = componentRef.instance.okSubject;
		this.cancelSubject = componentRef.instance.cancelSubject;

		// Enable/Disable the OK button
		componentRef.instance.disableOkSubject.pipe(untilDestroyed(this)).subscribe({
			next: (isOkDisabled) => {
				this.isOkDisabled = isOkDisabled;
			},
			error: (err) => {
				console.error(err);
			}
		});
	}

	ok() {
		this.okSubject.next();
		super.ok();
	}

	cancel() {
		this.cancelSubject.next();
		super.cancel();
	}

	ngAfterContentChecked(): void {
		// If there is a 'cdkFocusInitial' attribute in the document, turn auto-focus on.
		// If there isn't, leave it off to prevent the cdkTrapFocusAutoCapture from automatically focusing the
		// first element, which in this component is the 'Close' button.
		if (document.querySelector('[cdkFocusInitial]')) {
			this.isCdkFocusInitial = true;
		}
	}
}
