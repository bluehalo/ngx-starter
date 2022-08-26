import { HttpErrorResponse } from '@angular/common/http';
import { Directive, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { untilDestroyed } from '@ngneat/until-destroy';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';

import { ModalService } from '../../../common/modal/modal.service';
import { SystemAlertService } from '../../../common/system-alert/system-alert.service';
import { ConfigService } from '../../config.service';
import { Message } from '../../messages/message.model';

@Directive()
export abstract class ManageMessageComponent implements OnInit {
	message = new Message();
	error?: string;

	typeOptions: any[] = [
		{ value: 'MOTD', display: 'MOTD' },
		{ value: 'INFO', display: 'INFO' },
		{ value: 'WARN', display: 'WARN' },
		{ value: 'ERROR', display: 'ERROR' }
	];

	protected config: any;

	protected constructor(
		protected modalService: ModalService,
		protected router: Router,
		protected configService: ConfigService,
		public alertService: SystemAlertService,
		public title: string,
		public subtitle: string,
		public okButtonText: string,
		protected navigateOnSuccess: string
	) {}

	ngOnInit() {
		this.alertService.clearAllAlerts();

		this.configService
			.getConfig()
			.pipe(first(), untilDestroyed(this))
			.subscribe((config: any) => {
				this.config = config;
				this.initialize();
			});
	}

	abstract initialize(): void;

	abstract submitMessage(message: Message): Observable<any>;

	previewMessage() {
		const { body, title } = this.message;
		this.modalService.alert(title, body);
	}

	submit() {
		this.submitMessage(this.message)
			.pipe(untilDestroyed(this))
			.subscribe((message) => {
				if (message) {
					this.router.navigate([this.navigateOnSuccess]);
				}
			});
	}
}
