import { Component } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';
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

	private id: string;

	constructor(
		router: Router,
		protected route: ActivatedRoute,
		configService: ConfigService,
		alertService: SystemAlertService,
		protected messageService: MessageService
	) {
		super(router, configService, alertService);
	}

	initialize() {
		this.route.params.subscribe((params: Params) => {
			this.id = params[`id`];

			this.title = 'Edit Message';
			this.subtitle = "Make changes to the message's information";
			this.okButtonText = 'Save';
			this.navigateOnSuccess = '/admin/messages';
			this.okDisabled = false;
			this.messageService
				.get(this.id)
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
