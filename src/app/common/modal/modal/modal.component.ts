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
	okText = 'OK';

	/**
	 * Text to display on the modal 'cancel' button
	 */
	@Input()
	cancelText = 'Cancel';

	@Input()
	disableOk: boolean;

	@Input()
	autoCaptureFocus: boolean;

	@Output()
	readonly ok = new EventEmitter();

	@Output()
	readonly cancel = new EventEmitter();

	constructor() {}
}
