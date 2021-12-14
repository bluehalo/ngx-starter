import { Component, ContentChild, Input, TemplateRef } from '@angular/core';

@Component({
	selector: 'notification',
	templateUrl: 'notification.component.html',
	styleUrls: ['notification.component.scss']
})
export class NotificationComponent {
	@Input() notificationType: 'info' | 'success' | 'warning' | 'danger' = 'info';
	@Input() message = '';
	@Input() showActions = false;
	@Input() small = false;

	@ContentChild('notificationActions', { static: true }) actionTemplate: TemplateRef<any> | null =
		null;
}
