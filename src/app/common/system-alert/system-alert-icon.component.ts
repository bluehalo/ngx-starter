import { Component, Input } from '@angular/core';

@Component({
	selector: 'system-alert-icon',
	templateUrl: 'system-alert-icon.component.html'
})
export class SystemAlertIconComponent {
	@Input() icon = 'info';
}
