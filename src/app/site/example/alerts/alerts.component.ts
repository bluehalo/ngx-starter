import { Component, OnInit } from '@angular/core';

import { UntilDestroy } from '@ngneat/until-destroy';

import { SystemAlertService } from '../../../common/system-alert.module';
import { NavbarTopics } from '../../../core/site-navbar/navbar-topic.model';

@UntilDestroy()
@Component({
	templateUrl: './alerts.component.html'
})
export class AlertsComponent implements OnInit {
	constructor(public alertService: SystemAlertService) {}
	ngOnInit(): void {
		this.alertService.clearAllAlerts();
		this.alertService.addAlert('Success', 'success');
		this.alertService.addAlert('Danger', 'danger');
		this.alertService.addAlert('Warning', 'warning');
		this.alertService.addAlert('Info', 'info');
	}

	addAlert(msg: string, type: string): void {
		this.alertService.addAlert(msg, type);
	}
}

NavbarTopics.registerTopic({
	id: 'alerts',
	title: 'Alerts',
	ordinal: 8,
	path: 'alerts',
	iconClass: 'fa-exclamation-circle',
	hasSomeRoles: ['user']
});
