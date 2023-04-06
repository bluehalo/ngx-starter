import { Component } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { switchMap } from 'rxjs';

import { isNotNullOrUndefined } from '../../../common/rxjs-utils';
import { Message } from '../../messages/message.model';
import { MessageService } from '../../messages/message.service';
import { ManageMessageComponent } from './manage-message.component';

@UntilDestroy()
@Component({
	templateUrl: './manage-message.component.html'
})
export class UpdateMessageComponent extends ManageMessageComponent {
	mode = 'admin-edit';

	constructor(protected route: ActivatedRoute, protected messageService: MessageService) {
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
				untilDestroyed(this)
			)
			.subscribe((message) => {
				this.message = message;
			});
	}

	submitMessage(message: Message) {
		return this.messageService.update(message);
	}
}
