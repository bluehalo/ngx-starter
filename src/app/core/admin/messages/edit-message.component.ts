import { Component } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';
import { ModalService } from 'src/app/common/modal.module';
import { SystemAlertService } from 'src/app/common/system-alert.module';

import { ConfigService } from '../../config.service';
import { Message } from '../../messages/message.class';
import { MessageService } from '../../messages/message.service';
import { ManageMessageComponent } from './manage-message.component';

@UntilDestroy()
@Component({
	templateUrl: './manage-message.component.html'
})
export class UpdateMessageComponent extends ManageMessageComponent {
	mode = 'admin-edit';

	constructor(
		modalService: ModalService,
		router: Router,
		configService: ConfigService,
		alertService: SystemAlertService,
		protected route: ActivatedRoute,
		protected messageService: MessageService
	) {
		super(
			modalService,
			router,
			configService,
			alertService,
			'Edit Message',
			"Make changes to the message's information",
			'Save',
			'/admin/messages'
		);
	}

	initialize() {
		this.route.params.subscribe((params: Params) => {
			this.okDisabled = false;
			this.messageService
				.get(params[`id`])
				.pipe(untilDestroyed(this))
				.subscribe((messageRaw: any) => {
					this.message = new Message().setFromModel(messageRaw);
				});
		});
	}

	submitMessage(message: Message) {
		return this.messageService.update(message);
	}
}
