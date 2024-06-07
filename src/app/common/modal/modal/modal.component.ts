import { A11yModule } from '@angular/cdk/a11y';
import { ChangeDetectionStrategy, Component, booleanAttribute, input, output } from '@angular/core';

@Component({
	selector: 'asy-modal',
	templateUrl: './modal.component.html',
	styleUrls: ['./modal.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [A11yModule]
})
export class ModalComponent {
	/**
	 * Title to display in the modal header
	 */
	readonly title = input('');

	/**
	 * Text to display on the modal 'ok' button
	 */
	readonly okText = input('OK');

	/**
	 * Text to display on the modal 'cancel' button
	 */
	readonly cancelText = input('Cancel');

	readonly disableOk = input(false, { transform: booleanAttribute });
	readonly hideCancel = input(false, { transform: booleanAttribute });

	readonly ok = output();
	readonly cancel = output();
}
