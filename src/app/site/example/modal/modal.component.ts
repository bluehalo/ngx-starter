import { AsyncPipe, JsonPipe } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';

import { Subject } from 'rxjs';

import { ConfigurableDialogData, DialogService } from '../../../common/dialog';

@Component({
	templateUrl: './modal.component.html',
	standalone: true,
	imports: [FormsModule, AsyncPipe, JsonPipe]
})
export class ModalComponent {
	private destroyRef = inject(DestroyRef);
	dialogService = inject(DialogService);

	alertConfig: any = {
		title: 'Alert!',
		message: 'Something important happened!'
	};

	confirmConfig: any = {
		title: 'Confirm?',
		message: 'Are you sure?'
	};

	promptConfig: any = {
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

	alertOutput$ = new Subject<any>();
	confirmOutput$ = new Subject<any>();
	promptOutput$ = new Subject<any>();
	showOutput$ = new Subject<any>();

	showAlert() {
		this.dialogService
			.alert(this.alertConfig.title, this.alertConfig.message, this.alertConfig.okText)
			.closed.pipe(takeUntilDestroyed(this.destroyRef))
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
			.closed.pipe(takeUntilDestroyed(this.destroyRef))
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
			.closed.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe((returnData) => {
				this.promptOutput$.next(returnData);
			});
	}

	showModal() {
		this.showConfig.inputs = JSON.parse(this.showInputConfig);
		this.dialogService
			.show(this.showConfig)
			.closed.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe((returnData) => {
				this.showOutput$.next(returnData);
			});
	}
}
