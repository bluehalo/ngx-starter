import { Component } from '@angular/core';

import _isArray from 'lodash/isArray';
import _isObject from 'lodash/isObject';
import _keys from 'lodash/keys';

import { BsModalRef } from 'ngx-bootstrap';

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

	// Derived from http://stackoverflow.com/a/1359808 and http://stackoverflow.com/a/23124958
	sortObjectKeys(obj: any): any {
		if (null == obj || !_isObject(obj)) {
			return obj;
		}

		// Maintain the order of arrays, but sort keys of the array elements
		if (_isArray(obj)) {
			return obj.map( (o: any) => this.sortObjectKeys(o));
		}

		let sorted: any = {};
		let keys: string[] = _keys(obj).sort();

		for (let key of keys) {
			sorted[key] = this.sortObjectKeys(obj[key]);
		}

		return sorted;
	}
}
