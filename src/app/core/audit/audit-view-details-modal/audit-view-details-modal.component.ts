import { Component } from '@angular/core';

import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
	templateUrl: './audit-view-details-modal.component.html',
	styles: [
		`
			:host {
				display: contents;
			}
		`
	]
})
export class AuditViewDetailsModalComponent {
	auditEntry: any;

	constructor(public modalRef: BsModalRef) {}
}
