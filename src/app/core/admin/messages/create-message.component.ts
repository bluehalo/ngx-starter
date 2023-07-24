import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { NgSelectModule } from '@ng-select/ng-select';
import { UntilDestroy } from '@ngneat/until-destroy';

import { SystemAlertComponent } from '../../../common/system-alert/system-alert.component';
import { Message, MessageType } from '../../messages/message.model';
import { MessageService } from '../../messages/message.service';
import { ManageMessageComponent } from './manage-message.component';

@UntilDestroy()
@Component({
	templateUrl: './manage-message.component.html',
	standalone: true,
	imports: [NgIf, RouterLink, SystemAlertComponent, FormsModule, NgSelectModule]
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
