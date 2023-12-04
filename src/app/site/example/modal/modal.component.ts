import { AsyncPipe, JsonPipe } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';

import { Subject } from 'rxjs';

import { ConfigurableDialogData, DialogService } from '../../../common/dialog';
import { ModalService } from '../../../common/modal/modal.service';
import { FormModalComponent } from './form-modal.component';

@Component({
	selector: 'app-modal',
	templateUrl: './modal.component.html',
	standalone: true,
	imports: [FormsModule, AsyncPipe, JsonPipe]
})
export class ModalComponent {
	modalType = 'cdk';

	private destroyRef = inject(DestroyRef);
	dialogService = inject(DialogService);
	modalService = inject(ModalService);

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

	getService() {
		if (this.modalType === 'cdk') {
			return this.dialogService;
		}
		return this.modalService;
	}

	showAlert() {
		if (this.modalType === 'cdk') {
			this.dialogService
				.alert(this.alertConfig.title, this.alertConfig.message, this.alertConfig.okText)
				.closed.pipe(takeUntilDestroyed(this.destroyRef))
				.subscribe((returnData) => {
					this.alertOutput$.next(returnData);
				});
		} else {
			this.modalService
				.alert(this.alertConfig.title, this.alertConfig.message, this.alertConfig.okText)
				.pipe(takeUntilDestroyed(this.destroyRef))
				.subscribe((action) => {
					this.alertOutput$.next(action);
				});
		}
	}

	showConfirm() {
		if (this.modalType === 'cdk') {
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
		} else {
			this.modalService
				.confirm(
					this.alertConfig.title,
					this.alertConfig.message,
					this.alertConfig.okText,
					this.confirmConfig.cancelText
				)
				.pipe(takeUntilDestroyed(this.destroyRef))
				.subscribe((action) => {
					this.confirmOutput$.next(action);
				});
		}
	}

	showPrompt() {
		if (this.modalType === 'cdk') {
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
		} else {
			this.modalService
				.prompt(
					this.alertConfig.title,
					this.alertConfig.message,
					this.promptConfig.inputLabel,
					this.alertConfig.okText,
					this.confirmConfig.cancelText
				)
				.pipe(takeUntilDestroyed(this.destroyRef))
				.subscribe((action) => {
					this.promptOutput$.next(action);
				});
		}
	}

	showModal() {
		this.showConfig.inputs = JSON.parse(this.showInputConfig);
		if (this.modalType === 'cdk') {
			this.dialogService
				.show(this.showConfig)
				.closed.pipe(takeUntilDestroyed(this.destroyRef))
				.subscribe((returnData) => {
					this.showOutput$.next(returnData);
				});
		} else {
			this.modalService
				.show(this.showConfig)
				.pipe(takeUntilDestroyed(this.destroyRef))
				.subscribe((action) => {
					this.showOutput$.next(action);
				});
		}
	}

	showComponentModal() {
		if (this.modalType === 'cdk') {
		} else {
			this.modalService.showContainerModal({
				title: 'Showing My Component',
				okText: 'Submit',
				cancelText: 'Cancel',
				modalizableComponent: FormModalComponent
			});
		}
	}
}
