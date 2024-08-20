import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ModalComponent } from '../../modal/modal/modal.component';
import { DialogAction, DialogReturn } from '../dialog.model';

export type DialogInput = {
	type: 'textarea' | 'text';
	label: string;
	key: string;
	required: boolean;
};

export type DialogData = {
	title: string;
	message: string;
	okText?: string;
	cancelText?: string;
	hideCancel?: boolean;
};

export type PromptDialogData = DialogData & {
	inputLabel: string;
};

export type ConfigurableDialogData = DialogData & {
	inputs?: DialogInput[];
};

export type ConfigurableDialogReturn = DialogReturn<Record<string, string>>;

@Component({
	standalone: true,
	imports: [CommonModule, FormsModule, ReactiveFormsModule, ModalComponent],
	templateUrl: './configurable-dialog.component.html',
	styleUrls: ['./configurable-dialog.component.scss']
})
export class ConfigurableDialogComponent {
	dialogRef: DialogRef<ConfigurableDialogReturn> = inject(DialogRef);
	data: ConfigurableDialogData = inject(DIALOG_DATA);

	formData: Record<string, string> = {};

	cancel() {
		this.dialogRef.close({ action: DialogAction.CANCEL });
	}

	ok() {
		const event: ConfigurableDialogReturn = { action: DialogAction.OK };
		if (this.data.inputs) {
			event.data = this.formData;
		}
		this.dialogRef.close(event);
	}
}
