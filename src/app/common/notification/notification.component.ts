import { NgTemplateOutlet } from '@angular/common';
import {
	ChangeDetectionStrategy,
	Component,
	TemplateRef,
	booleanAttribute,
	contentChild,
	input
} from '@angular/core';

@Component({
	selector: 'notification',
	templateUrl: 'notification.component.html',
	styleUrls: ['notification.component.scss'],
	standalone: true,
	imports: [NgTemplateOutlet],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationComponent {
	readonly actionTemplate = contentChild<TemplateRef<any>>('notificationActions');

	readonly notificationType = input<'info' | 'success' | 'warning' | 'danger'>('info');
	readonly message = input('');
	readonly showActions = input(false, { transform: booleanAttribute });
	readonly small = input(false, { transform: booleanAttribute });
}
