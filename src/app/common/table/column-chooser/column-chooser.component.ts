import {
	CdkDrag,
	CdkDragDrop,
	CdkDragHandle,
	CdkDropList,
	moveItemInArray
} from '@angular/cdk/drag-drop';
import { NgFor, NgIf, TitleCasePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { LocalStorageService } from '../../storage/local-storage.service';

export type ColumnDefinition = {
	key: string;
	label?: string;
	selected?: boolean;
};

@Component({
	selector: 'asy-column-chooser',
	templateUrl: './column-chooser.component.html',
	styleUrls: ['./column-chooser.component.scss'],
	standalone: true,
	imports: [CdkDropList, NgFor, CdkDrag, NgIf, CdkDragHandle, FormsModule, TitleCasePipe]
})
export class ColumnChooserComponent implements OnInit {
	@Input()
	set columns(columns: ColumnDefinition[]) {
		this._columns = columns.map((c) => ({ ...c }));
		this._defaultColumns = columns.map((c) => ({ ...c }));
		this.onChange();
	}
	_columns: ColumnDefinition[] = [];
	_defaultColumns: ColumnDefinition[] = [];

	@Input()
	storageKey: string | null;

	@Input()
	sortingDisabled = false;

	@Output() readonly columnsChange: EventEmitter<string[]> = new EventEmitter();

	private storage = new LocalStorageService();

	constructor() {}

	ngOnInit(): void {
		this._loadState();
	}

	onDrop(event: CdkDragDrop<ColumnDefinition[]>) {
		moveItemInArray(this._columns, event.previousIndex, event.currentIndex);
		this.onChange();
	}

	onChange() {
		this._saveState();
		this.columnsChange.emit(this._columns.filter((c) => c.selected).map((c) => c.key));
	}

	restoreDefault() {
		this._columns = this._defaultColumns.map((c) => ({ ...c }));
		this.onChange();
	}

	selectAll() {
		this._columns.forEach((c) => {
			c.selected = true;
		});
		this.onChange();
	}

	_loadState() {
		if (this.storageKey) {
			const columnsOrder: string[] = this.storage.getValue(
				`${this.storageKey}-columns-order`,
				[]
			);
			const columnsSelected: string[] = this.storage.getValue(
				`${this.storageKey}-columns-selected`,
				[]
			);

			if (Array.isArray(columnsOrder) && columnsOrder.length > 0) {
				this._columns = [...this._columns].sort((a, b) => {
					let aOrderIndex = columnsOrder.indexOf(a.key);
					let bOrderIndex = columnsOrder.indexOf(b.key);

					if (aOrderIndex !== -1 && bOrderIndex !== -1) {
						return aOrderIndex - bOrderIndex;
					}

					if (aOrderIndex === -1 && bOrderIndex === -1) {
						aOrderIndex = this._columns.findIndex((col) => col.key === a.key);
						bOrderIndex = this._columns.findIndex((col) => col.key === b.key);
						return aOrderIndex - bOrderIndex;
					}

					if (aOrderIndex === -1) {
						return 1;
					}
					return -1;
				});
			}

			if (Array.isArray(columnsSelected) && columnsSelected.length > 0) {
				this._columns.forEach((c) => {
					c.selected = columnsSelected.indexOf(c.key) !== -1;
				});
			}

			this.onChange();
		}
	}

	_saveState() {
		if (this.storageKey) {
			this.storage.setValue(
				`${this.storageKey}-columns-selected`,
				this._columns.filter((c) => c.selected).map((c) => c.key)
			);

			this.storage.setValue(
				`${this.storageKey}-columns-order`,
				this._columns.map((c) => c.key)
			);
		}
	}
}
