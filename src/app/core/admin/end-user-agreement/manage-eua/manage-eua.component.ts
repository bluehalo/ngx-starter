import { TitleCasePipe } from '@angular/common';
import { Component, DestroyRef, computed, inject, input } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { DialogService } from '../../../../common/dialog';
import { SkipToDirective } from '../../../../common/directives/skip-to.directive';
import { SystemAlertComponent } from '../../../../common/system-alert/system-alert.component';
import { SystemAlertService } from '../../../../common/system-alert/system-alert.service';
import { EndUserAgreement } from '../eua.model';
import { EuaService } from '../eua.service';

@Component({
	standalone: true,
	templateUrl: './manage-eua.component.html',
	imports: [RouterLink, SystemAlertComponent, FormsModule, TitleCasePipe, SkipToDirective]
})
export class ManageEuaComponent {
	readonly #router = inject(Router);
	readonly #destroyRef = inject(DestroyRef);
	readonly #euaService = inject(EuaService);
	readonly #alertService = inject(SystemAlertService);
	readonly #dialogService = inject(DialogService);

	readonly eua = input.required({
		transform: (value?: EndUserAgreement) => value ?? new EndUserAgreement()
	});

	readonly mode = computed(() => (this.eua()._id ? 'edit' : 'create'));

	constructor() {
		this.#alertService.clearAllAlerts();
	}

	submitEua(): any {
		const obs$ =
			this.mode() === 'create'
				? this.#euaService.create(this.eua())
				: this.#euaService.update(this.eua());

		obs$.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe(() =>
			this.#router.navigate(['/admin/euas'])
		);
	}

	previewEua() {
		this.#dialogService.alert(this.eua().title, this.eua().text);
	}
}
