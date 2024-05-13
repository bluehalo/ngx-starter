import { TitleCasePipe } from '@angular/common';
import { Component, DestroyRef, Input, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { DialogService } from '../../../../common/dialog';
import { SystemAlertComponent } from '../../../../common/system-alert/system-alert.component';
import { SystemAlertService } from '../../../../common/system-alert/system-alert.service';
import { EndUserAgreement } from '../eua.model';
import { EuaService } from '../eua.service';

@Component({
	standalone: true,
	templateUrl: './manage-eua.component.html',
	imports: [RouterLink, SystemAlertComponent, FormsModule, TitleCasePipe]
})
export class ManageEuaComponent implements OnInit {
	readonly #router = inject(Router);
	readonly #destroyRef = inject(DestroyRef);
	readonly #euaService = inject(EuaService);
	readonly #alertService = inject(SystemAlertService);
	readonly #dialogService = inject(DialogService);

	mode: 'create' | 'edit' = 'create';

	error?: string;

	@Input()
	eua: EndUserAgreement;

	ngOnInit() {
		this.#alertService.clearAllAlerts();

		if (this.eua) {
			this.mode = 'edit';
		} else {
			this.eua = new EndUserAgreement();
		}
	}

	submitEua(): any {
		const obs$ =
			this.mode === 'create'
				? this.#euaService.create(this.eua)
				: this.#euaService.update(this.eua);

		obs$.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe(() =>
			this.#router.navigate(['/admin/euas'])
		);
	}

	previewEua() {
		this.#dialogService.alert(this.eua.title, this.eua.text);
	}
}
