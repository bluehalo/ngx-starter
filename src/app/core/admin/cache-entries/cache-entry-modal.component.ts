import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { JsonPipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';

import { ModalComponent } from '../../../common/modal/modal/modal.component';
import { AgoDatePipe } from '../../../common/pipes/ago-date.pipe';
import { UtcDatePipe } from '../../../common/pipes/utc-date-pipe/utc-date.pipe';
import { CacheEntry } from './cache-entry.model';

export class CacheEntryModalData {
	cacheEntry: CacheEntry;
}
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
	data: CacheEntryModalData = inject(DIALOG_DATA);
	dialogRef = inject(DialogRef);

	ngOnInit() {
		if (!this.data.cacheEntry) {
			throw new TypeError(`'CacheEntry' is required`);
		}
	}
}
