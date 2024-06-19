import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';

import { ModalComponent } from '../../../common';
import { SortObjectKeysPipe, UtcDatePipe } from '../../../common/pipes';
import { AuditViewDetailsModalComponent } from '../audit-view-details-modal/audit-view-details-modal.component';

@Component({
	templateUrl: './audit-view-change-modal.component.html',
	styles: [
		`
			:host {
				display: contents;
			}
		`
	],
	standalone: true,
	imports: [ModalComponent, JsonPipe, SortObjectKeysPipe, UtcDatePipe]
})
export class AuditViewChangeModalComponent extends AuditViewDetailsModalComponent {}
