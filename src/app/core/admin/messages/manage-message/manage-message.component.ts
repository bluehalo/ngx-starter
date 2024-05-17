import { TitleCasePipe } from '@angular/common';
import { Component, DestroyRef, Input, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { NgSelectModule } from '@ng-select/ng-select';

import { DialogService } from '../../../../common/dialog';
import { SkipToDirective } from '../../../../common/directives/skip-to.directive';
import { SystemAlertComponent } from '../../../../common/system-alert/system-alert.component';
import { SystemAlertService } from '../../../../common/system-alert/system-alert.service';
import { Message, MessageType } from '../../../messages/message.model';
import { MessageService } from '../../../messages/message.service';

@Component({
	standalone: true,
	templateUrl: './manage-message.component.html',
	styleUrls: ['./manage-message.component.scss'],
	imports: [
		RouterLink,
		SystemAlertComponent,
		FormsModule,
		NgSelectModule,
		TitleCasePipe,
		SkipToDirective
	]
})
export class ManageMessageComponent implements OnInit {
	mode: 'create' | 'edit' = 'create';

	@Input()
	message: Message;

	typeOptions: any[] = [
		{ value: 'MOTD', display: 'MOTD' },
		{ value: 'INFO', display: 'INFO' },
		{ value: 'WARN', display: 'WARN' },
		{ value: 'ERROR', display: 'ERROR' }
	];

	private destroyRef = inject(DestroyRef);
	private dialogService = inject(DialogService);
	private router = inject(Router);
	private alertService = inject(SystemAlertService);
	private messageService = inject(MessageService);

	ngOnInit() {
		this.alertService.clearAllAlerts();

		if (this.message) {
			this.mode = 'edit';
		} else {
			this.message = new Message();
			this.message.type = MessageType.MOTD;
		}
	}

	submitMessage() {
		const obs$ =
			this.mode === 'create'
				? this.messageService.create(this.message)
				: this.messageService.update(this.message);

		obs$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((message) => {
			this.router.navigate(['/admin/messages']);
		});
	}

	previewMessage() {
		this.dialogService.alert(this.message.title, this.message.body);
	}
}
