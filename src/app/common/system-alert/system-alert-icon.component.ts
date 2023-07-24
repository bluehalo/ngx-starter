import { NgSwitch, NgSwitchCase } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
	selector: 'system-alert-icon',
	templateUrl: 'system-alert-icon.component.html',
	standalone: true,
	imports: [NgSwitch, NgSwitchCase]
})
export class SystemAlertIconComponent {
	@Input() icon = 'info';
}
