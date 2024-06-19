import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';

import { ModalComponent } from '../../../../common';
import { DialogAction } from '../../../../common/dialog';
import { AgoDatePipe, UtcDatePipe } from '../../../../common/pipes';
import { CacheEntry } from '../cache-entry.model';

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
	imports: [ModalComponent, JsonPipe, AgoDatePipe, UtcDatePipe],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class CacheEntryModalComponent implements OnInit {
	readonly #dialogRef = inject(DialogRef);
	readonly #data: CacheEntryModalData = inject(DIALOG_DATA);

	cacheEntry = this.#data.cacheEntry;

	ngOnInit() {
		if (!this.#data.cacheEntry) {
			throw new TypeError(`'CacheEntry' is required`);
		}
	}

	close() {
		this.#dialogRef.close({ action: DialogAction.OK });
	}
}
