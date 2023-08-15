import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ModalComponent } from '../../modal/modal/modal.component';
import { DialogAction, DialogReturn } from '../dialog.modal';

export type DialogInput = {
	type: 'textarea' | 'text';
	label: string;
	key: string;
	required: boolean;
};

export class ConfigurableDialogData {
	title: string;
	okText: string;
	cancelText?: string;
	message: string;
	inputs?: DialogInput[];
}

@Component({
	standalone: true,
	imports: [CommonModule, FormsModule, ReactiveFormsModule, ModalComponent],
	templateUrl: './configurable-dialog.component.html',
	styleUrls: ['./configurable-dialog.component.scss']
})
export class ConfigurableDialogComponent {
	data: ConfigurableDialogData = inject(DIALOG_DATA);
	dialogRef = inject(DialogRef);

	formData: any = {};

	cancel() {
		this.dialogRef.close({ action: DialogAction.CANCEL });
	}

	ok() {
		const event: DialogReturn<any> = { action: DialogAction.OK };
		if (this.data.inputs) {
			event.data = this.formData;
		}
		this.dialogRef.close(event);
	}
}
