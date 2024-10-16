import { TitleCasePipe } from '@angular/common';
import { Component, DestroyRef, computed, inject, input } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { SkipToDirective } from '../../../../common';
import { DialogService } from '../../../../common/dialog';
import { SystemAlertComponent, SystemAlertService } from '../../../../common/system-alert';
import { EndUserAgreement } from '../../../auth';
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

	submitEua(): void {
		const obs$ =
			this.mode() === 'create'
				? this.#euaService.create(this.eua())
				: this.#euaService.update(this.eua());

		obs$.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe(() =>
			this.#router.navigate(['/admin/euas'])
		);
	}

	previewEua(): void {
		this.#dialogService.alert(this.eua().title, this.eua().text);
	}
}
