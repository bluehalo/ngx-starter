import { Component } from '@angular/core';

import { BsModalRef } from 'ngx-bootstrap/modal';
import { CacheEntry } from './cache-entry.model';

@Component({
	templateUrl: 'cache-entry-modal.component.html'
})
export class CacheEntryModalComponent {
	cacheEntry: CacheEntry;

	constructor(public modalRef: BsModalRef) {}
}
