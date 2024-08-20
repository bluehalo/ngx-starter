import { Dialog, DialogConfig, DialogRef } from '@angular/cdk/dialog';
import { ComponentType } from '@angular/cdk/overlay';
import { Injectable, inject } from '@angular/core';

import {
	ConfigurableDialogComponent,
	ConfigurableDialogData,
	ConfigurableDialogReturn
} from './configurable-dialog/configurable-dialog.component';
import { DialogReturn } from './dialog.model';

@Injectable({
	providedIn: 'root'
})
export class DialogService {
	dialog = inject(Dialog);

	alert(
		title: string,
		message: string,
		okText = 'OK',
		modalOptions?: DialogConfig
	): DialogRef<DialogReturn<void>> {
		return this.show(
			{
				title,
				message,
				okText,
				hideCancel: true
			},
			modalOptions
		);
	}

	confirm(
		title: string,
		message: string,
		okText = 'OK',
		cancelText = 'Cancel',
		modalOptions?: DialogConfig
	): DialogRef<DialogReturn<void>> {
		return this.show(
			{
				title,
				message,
				okText,
				cancelText
			},
			modalOptions
		);
	}

	prompt(
		title: string,
		message: string,
		inputLabel: string,
		okText = 'OK',
		cancelText = 'Cancel',
		modalOptions?: DialogConfig
	): DialogRef<DialogReturn<{ prompt: string }>> {
		return this.show(
			{
				title,
				message,
				okText,
				cancelText,
				inputs: [{ type: 'text', label: inputLabel, key: 'prompt', required: true }]
			},
			modalOptions
		);
	}

	/**
	 * The show method will display a modal that can include a message and a form
	 */
	show<R = ConfigurableDialogReturn>(
		contentConfig: ConfigurableDialogData,
		modalOptions: DialogConfig = {}
	) {
		const config = {
			disableClose: true,
			data: contentConfig,
			...DialogConfig
		};

		return this.dialog.open<R>(ConfigurableDialogComponent, config);
	}

	// Pass through to Dialog.open.  This allows for standardizing on using DialogService everywhere.
	open<R = unknown, D = unknown, C = unknown>(
		component: ComponentType<C>,
		config?: DialogConfig<D, DialogRef<R, C>>
	): DialogRef<R, C> {
		return this.dialog.open(component, config);
	}
}
