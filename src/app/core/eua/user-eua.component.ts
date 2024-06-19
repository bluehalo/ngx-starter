import { AsyncPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
	ChangeDetectionStrategy,
	Component,
	DestroyRef,
	OnInit,
	computed,
	inject,
	signal
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';

import { Observable } from 'rxjs';

import { SystemAlertComponent, SystemAlertService } from '../../common/system-alert';
import { EndUserAgreement, SessionService } from '../auth';
import { NavigationService } from '../navigation.service';
import { APP_SESSION } from '../tokens';

@Component({
	templateUrl: 'user-eua.component.html',
	standalone: true,
	imports: [SystemAlertComponent, FormsModule, AsyncPipe],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserEuaComponent implements OnInit {
	readonly #destroyRef = inject(DestroyRef);
	readonly #sessionService = inject(SessionService);
	readonly #navigationService = inject(NavigationService);
	readonly #alertService = inject(SystemAlertService);
	readonly #session = inject(APP_SESSION);

	readonly agree = signal(false);

	readonly alreadyAccepted = computed(() => this.#session().isEuaCurrent());

	eua$: Observable<EndUserAgreement | undefined>;

	ngOnInit() {
		this.#alertService.clearAllAlerts();
		this.eua$ = this.#sessionService.getCurrentEua();
	}

	accept() {
		this.#alertService.clearAllAlerts();
		this.#sessionService
			.acceptEua()
			.pipe(takeUntilDestroyed(this.#destroyRef))
			.subscribe({
				next: () => {
					this.#navigationService.navigateToPreviousRoute();
				},
				error: (error: unknown) => {
					if (error instanceof HttpErrorResponse) {
						this.#alertService.addAlert(error.error.message);
					}
				}
			});
	}
}
