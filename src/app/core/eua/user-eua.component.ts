import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';

import { SystemAlertService } from '../../common/system-alert.module';
import { SessionService } from '../auth/session.service';

@UntilDestroy()
@Component({
	templateUrl: 'user-eua.component.html'
})
export class UserEuaComponent implements OnInit {
	agree = false;

	eua: any;

	showAlerts = false;

	constructor(private sessionService: SessionService, private alertService: SystemAlertService) {}

	ngOnInit() {
		this.alertService.clearAllAlerts();
		this.sessionService
			.getCurrentEua()
			.pipe(untilDestroyed(this))
			.subscribe((eua: any) => (this.eua = eua));
	}

	accept() {
		this.alertService.clearAllAlerts();
		this.showAlerts = true;
		this.sessionService
			.acceptEua()
			.pipe(untilDestroyed(this))
			.subscribe(
				() => {
					this.sessionService.goToPreviousRoute();
				},
				(error: HttpErrorResponse) => {
					this.alertService.addAlert(error.error.message);
				}
			);
	}
}
