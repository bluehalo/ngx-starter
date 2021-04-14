import { Component } from '@angular/core';

import { AuditViewDetailsModalComponent } from '../audit-view-details-modal/audit-view-details-modal.component';

@Component({
	templateUrl: './audit-view-change-modal.component.html',
	styles: [
		`
			:host {
				display: contents;
			}
		`
	]
})
export class AuditViewChangeModalComponent extends AuditViewDetailsModalComponent {}
