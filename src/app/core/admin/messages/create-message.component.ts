import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { UntilDestroy } from '@ngneat/until-destroy';

import { ModalService } from '../../../common/modal/modal.service';
import { SystemAlertService } from '../../../common/system-alert/system-alert.service';
import { ConfigService } from '../../config.service';
import { Message, MessageType } from '../../messages/message.class';
import { MessageService } from '../../messages/message.service';
import { ManageMessageComponent } from './manage-message.component';

@UntilDestroy()
@Component({
	templateUrl: './manage-message.component.html'
})
export class CreateMessageComponent extends ManageMessageComponent {
	mode = 'admin-create';

	constructor(
		modalService: ModalService,
		router: Router,
		configService: ConfigService,
		alertService: SystemAlertService,
		private messageService: MessageService
	) {
		super(
			modalService,
			router,
			configService,
			alertService,
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
