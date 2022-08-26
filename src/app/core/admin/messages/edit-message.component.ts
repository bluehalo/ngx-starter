import { Component } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';
import { switchMap } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { ModalService } from '../../../common/modal/modal.service';
import { isNotNullOrUndefined } from '../../../common/rxjs-utils';
import { SystemAlertService } from '../../../common/system-alert/system-alert.service';
import { ConfigService } from '../../config.service';
import { Message } from '../../messages/message.model';
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
				switchMap((params: Params) => this.messageService.read(params['id'])),
				isNotNullOrUndefined()
			)
			.subscribe((message) => {
				this.message = message;
			});
	}

	submitMessage(message: Message) {
		return this.messageService.update(message);
	}
}
