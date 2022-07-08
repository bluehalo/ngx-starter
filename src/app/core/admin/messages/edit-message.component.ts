import { Component } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';
import { switchMap } from 'rxjs';
import { map } from 'rxjs/operators';

import { ModalService } from '../../../common/modal/modal.service';
import { SystemAlertService } from '../../../common/system-alert/system-alert.service';
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
		this.route.params
			.pipe(
				untilDestroyed(this),
				switchMap((params: Params) => this.messageService.get(params['id'])),
				map((messageRaw: any) => new Message().setFromModel(messageRaw))
			)
			.subscribe((message) => {
				this.message = message;
			});
	}

	submitMessage(message: Message) {
		return this.messageService.update(message);
	}
}
