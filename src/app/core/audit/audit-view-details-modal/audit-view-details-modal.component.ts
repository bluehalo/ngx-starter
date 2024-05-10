import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { JsonPipe, TitleCasePipe } from '@angular/common';
import { Component, inject } from '@angular/core';

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
	imports: [ModalComponent, JsonPipe, TitleCasePipe, UtcDatePipe]
})
export class AuditViewDetailsModalComponent {
	#dialogRef = inject(DialogRef);
	#data = inject(DIALOG_DATA);

	auditEntry: any;

	constructor() {
		this.auditEntry = this.#data.auditEntry;
	}

	close() {
		this.#dialogRef.close();
	}
}
