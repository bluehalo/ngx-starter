import { Component, Input, OnInit } from '@angular/core';

import { BsModalRef } from 'ngx-bootstrap/modal';
import { CacheEntry } from './cache-entry.model';

@Component({
	templateUrl: 'cache-entry-modal.component.html',
	styles: [
		`
			:host {
				display: contents;
			}
		`
	]
})
export class CacheEntryModalComponent implements OnInit {
	@Input()
	cacheEntry!: CacheEntry;

	constructor(public modalRef: BsModalRef) {}

	ngOnInit() {
		if (!this.cacheEntry) {
			throw new TypeError(`'CacheEntry' is required`);
		}
	}
}
