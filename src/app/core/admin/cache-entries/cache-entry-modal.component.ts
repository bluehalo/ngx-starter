import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { JsonPipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';

import { DialogAction } from '../../../common/dialog';
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
	cacheEntry: CacheEntry;

	private dialogRef = inject(DialogRef);
	private data: CacheEntryModalData = inject(DIALOG_DATA);

	constructor() {
		this.cacheEntry = this.data.cacheEntry;
	}

	ngOnInit() {
		if (!this.data.cacheEntry) {
			throw new TypeError(`'CacheEntry' is required`);
		}
	}

	close() {
		this.dialogRef.close({ action: DialogAction.OK });
	}
}
