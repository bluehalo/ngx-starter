import { AsyncPipe, JsonPipe } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';

import { filterNil } from 'ngxtension/filter-nil';
import { Subject } from 'rxjs';

import {
	ConfigurableDialogData,
	ConfigurableDialogReturn,
	DialogData,
	DialogReturn,
	DialogService,
	PromptDialogData
} from '../../../common/dialog';

@Component({
	templateUrl: './modal.component.html',
	standalone: true,
	imports: [FormsModule, AsyncPipe, JsonPipe]
})
export class ModalComponent {
	private destroyRef = inject(DestroyRef);
	dialogService = inject(DialogService);

	alertConfig: DialogData = {
		title: 'Alert!',
		message: 'Something important happened!'
	};

	confirmConfig: DialogData = {
		title: 'Confirm?',
		message: 'Are you sure?'
	};

	promptConfig: PromptDialogData = {
		title: 'Prompt',
		message: 'Are you sure?',
		inputLabel: 'Input'
	};

	showConfig: ConfigurableDialogData = {
		title: 'Custom Input',
		message: 'Are you sure?',
		okText: 'OK',
		cancelText: 'Cancel'
	};
	showInputConfig = `[
	{ "type": "text", "label": "Field 1", "key": "field1", "required": true },
	{ "type": "textarea", "label": "Field 2", "key": "field2", "required": true }
]`;

	alertOutput$ = new Subject<DialogReturn>();
	confirmOutput$ = new Subject<DialogReturn>();
	promptOutput$ = new Subject<DialogReturn<{ prompt: string }>>();
	showOutput$ = new Subject<ConfigurableDialogReturn>();

	showAlert() {
		this.dialogService
			.alert(this.alertConfig.title, this.alertConfig.message, this.alertConfig.okText)
			.closed.pipe(filterNil(), takeUntilDestroyed(this.destroyRef))
			.subscribe((returnData) => {
				this.alertOutput$.next(returnData);
			});
	}

	showConfirm() {
		this.dialogService
			.confirm(
				this.alertConfig.title,
				this.alertConfig.message,
				this.alertConfig.okText,
				this.confirmConfig.cancelText
			)
			.closed.pipe(filterNil(), takeUntilDestroyed(this.destroyRef))
			.subscribe((returnData) => {
				this.confirmOutput$.next(returnData);
			});
	}

	showPrompt() {
		this.dialogService
			.prompt(
				this.alertConfig.title,
				this.alertConfig.message,
				this.promptConfig.inputLabel,
				this.alertConfig.okText,
				this.confirmConfig.cancelText
			)
			.closed.pipe(filterNil(), takeUntilDestroyed(this.destroyRef))
			.subscribe((returnData) => {
				this.promptOutput$.next(returnData);
			});
	}

	showModal() {
		this.dialogService
			.show({ ...this.showConfig, inputs: JSON.parse(this.showInputConfig) })
			.closed.pipe(filterNil(), takeUntilDestroyed(this.destroyRef))
			.subscribe((returnData) => {
				this.showOutput$.next(returnData);
			});
	}
}
