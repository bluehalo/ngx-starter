import { Component } from '@angular/core';

import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
	templateUrl: 'audit-view-details.component.html'
})
export class AuditViewDetailModal {

	auditEntry: any;

	constructor(
		public modalRef: BsModalRef
	) {}
}

@Component({
	templateUrl: 'audit-view-change.component.html'
})
export class AuditViewChangeModal extends AuditViewDetailModal {

	constructor(
		public modalRef: BsModalRef
	) {
		super(modalRef);
	}

}
