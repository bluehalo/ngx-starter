import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { UntilDestroy } from '@ngneat/until-destroy';
import { ModalService } from 'src/app/common/modal.module';
import { SystemAlertService } from 'src/app/common/system-alert.module';
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
		protected modalService: ModalService,
		router: Router,
		configService: ConfigService,
		alertService: SystemAlertService,
		private messageService: MessageService
	) {
		super(modalService, router, configService, alertService);
	}

	initialize() {
		this.title = 'Create Message';
		this.subtitle = 'Provide the required information to create a new message';
		this.okButtonText = 'Create';
		this.navigateOnSuccess = '/admin/messages';
		this.message = new Message();
		this.message.type = MessageType.MOTD;
	}

	submitMessage(message: Message) {
		return this.messageService.create(message);
	}
}
