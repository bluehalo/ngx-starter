import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
	selector: 'asy-modal',
	templateUrl: './modal.component.html',
	styleUrls: ['./modal.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalComponent {
	/**
	 * Title to display in the modal header
	 */
	@Input()
	title: string;

	/**
	 * Text to display on the modal 'ok' button
	 */
	@Input()
	okText: string = 'OK';

	/**
	 * Text to display on the modal 'cancel' button
	 */
	@Input()
	cancelText: string = 'Cancel';

	@Input()
	disableOk: boolean;

	@Input()
	autoCaptureFocus: boolean;

	@Output()
	ok = new EventEmitter();

	@Output()
	cancel = new EventEmitter();

	constructor() {}
}
