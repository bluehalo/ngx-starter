import { Component } from '@angular/core';

import { UntilDestroy } from '@ngneat/until-destroy';

import { Message, MessageType } from '../../messages/message.model';
import { MessageService } from '../../messages/message.service';
import { ManageMessageComponent } from './manage-message.component';

@UntilDestroy()
@Component({
	templateUrl: './manage-message.component.html'
})
export class CreateMessageComponent extends ManageMessageComponent {
	mode = 'admin-create';

	constructor(private messageService: MessageService) {
		super(
			'Create Message',
			'Provide the required information to create a new message',
			'Create',
			'/admin/messages'
		);
	}

	initialize() {
		this.message.type = MessageType.MOTD;
	}

	submitMessage(message: Message) {
		return this.messageService.create(message);
	}
}
