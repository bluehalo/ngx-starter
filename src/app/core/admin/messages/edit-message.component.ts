import { NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Params, RouterLink } from '@angular/router';

import { NgSelectModule } from '@ng-select/ng-select';
import { switchMap } from 'rxjs';

import { isNotNullOrUndefined } from '../../../common/rxjs-utils';
import { SystemAlertComponent } from '../../../common/system-alert/system-alert.component';
import { Message } from '../../messages/message.model';
import { MessageService } from '../../messages/message.service';
import { ManageMessageComponent } from './manage-message.component';

@Component({
	templateUrl: './manage-message.component.html',
	standalone: true,
	imports: [NgIf, RouterLink, SystemAlertComponent, FormsModule, NgSelectModule]
})
export class UpdateMessageComponent extends ManageMessageComponent {
	mode = 'admin-edit';

	protected route = inject(ActivatedRoute);
	protected messageService = inject(MessageService);

	constructor() {
		super(
			'Edit Message',
			"Make changes to the message's information",
			'Save',
			'/admin/messages'
		);
	}

	initialize() {
		this.route.params
			.pipe(
				switchMap((params: Params) => this.messageService.read(params['id'])),
				isNotNullOrUndefined(),
				takeUntilDestroyed(this.destroyRef)
			)
			.subscribe((message) => {
				this.message = message;
			});
	}

	submitMessage(message: Message) {
		return this.messageService.update(message);
	}
}
