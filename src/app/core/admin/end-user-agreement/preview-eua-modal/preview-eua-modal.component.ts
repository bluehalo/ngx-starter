import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ModalComponent } from '../../../../common';
import { DialogAction } from '../../../../common/dialog';
import { EndUserAgreement } from '../../../auth';

export type PreviewEuaModalData = {
	eua: EndUserAgreement;
};

@Component({
	selector: 'app-preview-eua-modal',
	standalone: true,
	imports: [FormsModule, ModalComponent],
	templateUrl: './preview-eua-modal.component.html',
	styleUrl: './preview-eua-modal.component.scss'
})
export class PreviewEuaModalComponent {
	readonly #dialogRef = inject(DialogRef);

	readonly data: PreviewEuaModalData = inject(DIALOG_DATA);

	close() {
		this.#dialogRef.close({ action: DialogAction.CANCEL });
	}
}
