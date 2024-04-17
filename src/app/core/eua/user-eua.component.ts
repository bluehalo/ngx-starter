import { AsyncPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';

import { Observable } from 'rxjs';

import { SystemAlertComponent } from '../../common/system-alert/system-alert.component';
import { SystemAlertService } from '../../common/system-alert/system-alert.service';
import { AuthorizationService } from '../auth/authorization.service';
import { SessionService } from '../auth/session.service';
import { NavigationService } from '../navigation.service';

@Component({
	templateUrl: 'user-eua.component.html',
	standalone: true,
	imports: [SystemAlertComponent, FormsModule, AsyncPipe]
})
export class UserEuaComponent implements OnInit {
	agree = false;

	eua$: Observable<any>;

	alreadyAccepted: boolean;

	private destroyRef = inject(DestroyRef);
	private sessionService = inject(SessionService);
	private navigationService = inject(NavigationService);
	private alertService = inject(SystemAlertService);
	private authorizationService = inject(AuthorizationService);

	ngOnInit() {
		this.alertService.clearAllAlerts();
		this.eua$ = this.sessionService.getCurrentEua();
		this.alreadyAccepted = this.authorizationService.isEuaCurrent();
	}

	accept() {
		this.alertService.clearAllAlerts();
		this.sessionService
			.acceptEua()
			.pipe(takeUntilDestroyed(this.destroyRef))
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
