import { Component, OnInit } from '@angular/core';

import { SystemAlertService } from '../../../common/system-alert.module';

import { NavbarTopics } from '../../../core/site-navbar/navbar-topic.model';

import { UntilDestroy } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
	templateUrl: './alerts.component.html'
})
export class AlertsComponent implements OnInit {
	constructor(public alertService: SystemAlertService) {}
	ngOnInit(): void {
		this.alertService.addAlert('Success', 'success');
		this.alertService.addAlert('Danger', 'danger');
		this.alertService.addAlert('Warning', 'warning');
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
