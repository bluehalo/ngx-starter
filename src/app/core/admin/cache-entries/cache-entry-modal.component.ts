import { Component } from '@angular/core';

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
export class CacheEntryModalComponent {
	cacheEntry: CacheEntry;

	constructor(public modalRef: BsModalRef) {}
}
