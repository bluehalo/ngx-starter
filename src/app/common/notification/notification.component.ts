import { NgIf, NgTemplateOutlet } from '@angular/common';
import { Component, ContentChild, Input, TemplateRef } from '@angular/core';

@Component({
	selector: 'notification',
	templateUrl: 'notification.component.html',
	styleUrls: ['notification.component.scss'],
	standalone: true,
	imports: [NgIf, NgTemplateOutlet]
})
export class NotificationComponent {
	@ContentChild('notificationActions', { static: true }) actionTemplate: TemplateRef<any> | null =
		null;

	@Input()
	notificationType: 'info' | 'success' | 'warning' | 'danger' = 'info';

	@Input()
	message = '';

	@Input()
	showActions = false;

	@Input()
	small = false;
}
