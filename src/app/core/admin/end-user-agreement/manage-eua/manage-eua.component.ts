import { NgIf, TitleCasePipe } from '@angular/common';
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
	imports: [RouterLink, SystemAlertComponent, FormsModule, NgIf, TitleCasePipe]
})
export class ManageEuaComponent implements OnInit {
	mode: 'create' | 'edit' = 'create';

	error?: string;

	@Input()
	eua: EndUserAgreement;

	private router = inject(Router);
	private destroyRef = inject(DestroyRef);
	private euaService = inject(EuaService);
	private alertService = inject(SystemAlertService);
	private dialogService = inject(DialogService);

	ngOnInit() {
		this.alertService.clearAllAlerts();

		if (this.eua) {
			this.mode = 'edit';
		} else {
			this.eua = new EndUserAgreement();
		}
	}

	submitEua(): any {
		const obs$ =
			this.mode === 'create'
				? this.euaService.create(this.eua)
				: this.euaService.update(this.eua);

		obs$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() =>
			this.router.navigate(['/admin/euas'])
		);
	}

	previewEua() {
		this.dialogService.alert(this.eua.title, this.eua.text);
	}
}
