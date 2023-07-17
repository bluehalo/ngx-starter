import { JsonPipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

import { BsModalRef } from 'ngx-bootstrap/modal';

import { ModalComponent } from '../../../common/modal/modal/modal.component';
import { AgoDatePipe } from '../../../common/pipes/ago-date.pipe';
import { UtcDatePipe } from '../../../common/pipes/utc-date-pipe/utc-date.pipe';
import { CacheEntry } from './cache-entry.model';

@Component({
	templateUrl: 'cache-entry-modal.component.html',
	styles: [
		`
			:host {
				display: contents;
			}
		`
	],
	standalone: true,
	imports: [ModalComponent, JsonPipe, AgoDatePipe, UtcDatePipe]
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
