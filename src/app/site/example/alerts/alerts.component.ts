import { Component, OnInit } from '@angular/core';

import { UntilDestroy } from '@ngneat/until-destroy';

import { SystemAlertComponent } from '../../../common/system-alert/system-alert.component';
import { SystemAlertService } from '../../../common/system-alert/system-alert.service';

@UntilDestroy()
@Component({
	templateUrl: './alerts.component.html',
	standalone: true,
	imports: [SystemAlertComponent]
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
