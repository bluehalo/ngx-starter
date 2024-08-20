import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { JsonPipe, TitleCasePipe } from '@angular/common';
import { Component, inject } from '@angular/core';

import { ModalComponent } from '../../../common';
import { UtcDatePipe } from '../../../common/pipes';
import { AuditEntry } from '../audit-entry.model';

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
	#data: { auditEntry: AuditEntry } = inject(DIALOG_DATA);

	auditEntry: AuditEntry;

	constructor() {
		this.auditEntry = this.#data.auditEntry;
	}

	close() {
		this.#dialogRef.close();
	}
}
