import { JsonPipe, NgIf, TitleCasePipe } from '@angular/common';
import { Component } from '@angular/core';

import { BsModalRef } from 'ngx-bootstrap/modal';

import { ModalComponent } from '../../../common/modal/modal/modal.component';
import { UtcDatePipe } from '../../../common/pipes/utc-date-pipe/utc-date.pipe';

@Component({
	templateUrl: './audit-view-details-modal.component.html',
	styles: [
		`
			:host {
				display: contents;
			}
		`
	],
	standalone: true,
	imports: [ModalComponent, NgIf, JsonPipe, TitleCasePipe, UtcDatePipe]
})
export class AuditViewDetailsModalComponent {
	auditEntry: any;

	constructor(public modalRef: BsModalRef) {}
}
