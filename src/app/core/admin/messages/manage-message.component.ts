import { DestroyRef, Directive, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';

import { DialogService } from '../../../common/dialog';
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

	protected destroyRef = inject(DestroyRef);
	protected dialogService = inject(DialogService);
	protected router = inject(Router);
	protected configService = inject(ConfigService);
	protected alertService = inject(SystemAlertService);

	protected constructor(
		public title: string,
		public subtitle: string,
		public okButtonText: string,
		protected navigateOnSuccess: string
	) {}

	ngOnInit() {
		this.alertService.clearAllAlerts();

		this.configService
			.getConfig()
			.pipe(first(), takeUntilDestroyed(this.destroyRef))
			.subscribe((config: any) => {
				this.config = config;
				this.initialize();
			});
	}

	abstract initialize(): void;

	abstract submitMessage(message: Message): Observable<any>;

	previewMessage() {
		const { body, title } = this.message;
		this.dialogService.alert(title, body);
	}

	submit() {
		this.submitMessage(this.message)
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe((message) => {
				if (message) {
					this.router.navigate([this.navigateOnSuccess]);
				}
			});
	}
}
