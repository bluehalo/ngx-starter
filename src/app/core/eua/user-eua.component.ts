import { AsyncPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, OnInit, computed, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';

import { Observable } from 'rxjs';

import { SystemAlertComponent } from '../../common/system-alert/system-alert.component';
import { SystemAlertService } from '../../common/system-alert/system-alert.service';
import { SessionService } from '../auth';
import { NavigationService } from '../navigation.service';
import { APP_SESSION } from '../tokens';

@Component({
	templateUrl: 'user-eua.component.html',
	standalone: true,
	imports: [SystemAlertComponent, FormsModule, AsyncPipe]
})
export class UserEuaComponent implements OnInit {
	agree = false;

	eua$: Observable<any>;

	private destroyRef = inject(DestroyRef);
	private sessionService = inject(SessionService);
	private navigationService = inject(NavigationService);
	private alertService = inject(SystemAlertService);
	#session = inject(APP_SESSION);

	alreadyAccepted = computed(() => this.#session().isEuaCurrent());

	ngOnInit() {
		this.alertService.clearAllAlerts();
		this.eua$ = this.sessionService.getCurrentEua();
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
