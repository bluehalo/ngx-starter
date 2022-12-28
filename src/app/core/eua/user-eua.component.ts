import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';
import { Observable } from 'rxjs';

import { SystemAlertService } from '../../common/system-alert/system-alert.service';
import { AuthorizationService } from '../auth/authorization.service';
import { SessionService } from '../auth/session.service';
import { NavigationService } from '../navigation.service';

@UntilDestroy()
@Component({
	templateUrl: 'user-eua.component.html'
})
export class UserEuaComponent implements OnInit {
	agree = false;

	eua$: Observable<any>;

	alreadyAccepted: boolean;

	constructor(
		private sessionService: SessionService,
		private navigationService: NavigationService,
		private alertService: SystemAlertService,
		private authorizationService: AuthorizationService
	) {}

	ngOnInit() {
		this.alertService.clearAllAlerts();
		this.eua$ = this.sessionService.getCurrentEua();
		this.alreadyAccepted = this.authorizationService.isEuaCurrent();
	}

	accept() {
		this.alertService.clearAllAlerts();
		this.sessionService
			.acceptEua()
			.pipe(untilDestroyed(this))
			.subscribe({
				next: () => {
					this.navigationService.navigateToPreviousRoute();
				},
				error: (error: unknown) => {
					if (error instanceof HttpErrorResponse) {
						this.alertService.addAlert(error.error.message);
					}
				}
			});
	}
}
