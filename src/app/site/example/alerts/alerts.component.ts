import { TitleCasePipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NgSelectModule } from '@ng-select/ng-select';

import { SystemAlertComponent, SystemAlertService } from '../../../common/system-alert';

@Component({
	templateUrl: './alerts.component.html',
	standalone: true,
	imports: [SystemAlertComponent, FormsModule, NgSelectModule, TitleCasePipe]
})
export class AlertsComponent implements OnInit {
	message = '';
	type = 'success';
	subtext = '';
	ttl = 0;

	private alertService = inject(SystemAlertService);

	ngOnInit(): void {
		this.alertService.clearAllAlerts();
		this.alertService.addAlert('Success', 'success', 0, 'subtext');
		this.alertService.addAlert('Danger', 'danger');
		this.alertService.addAlert('Warning', 'warning');
		this.alertService.addAlert('Info', 'info');
	}

	addAlert(): void {
		this.alertService.addAlert(this.message, this.type, this.ttl, this.subtext);
	}
}
