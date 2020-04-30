import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { SortChange } from '../sorting.model';

export interface SortableTableHeader {
	name: string;
	sortField?: string;
	sortDir?: string;
	sortable: boolean;
	default?: boolean;
	tooltip?: string;
	iconClass?: string;
}
@Component({
	selector: 'sortable-table-header',
	templateUrl: 'sortable-table-header.component.html',
	styleUrls: ['sortable-table-header.component.scss']
})
export class SortableTableHeaderComponent implements OnInit {
	@Input() header: any;

	@Input() showSort = true;

	@Input() currentSortField: string | string[];

	@Input() currentSortDir: string;

	@Output() readonly sortChange = new EventEmitter<SortChange>();

	sortable: boolean;

	ngOnInit() {
		this.sortable = this.header.sortable && this.showSort;
	}

	sort() {
		if (this.sortable) {
			// If this header is the currently sorted field, reverse the sort
			if (
				this.header.sortField === this.currentSortField ||
				this.currentSortField.includes(this.header.sortField)
			) {
				this.sortChange.emit({
					sortField: this.header.sortField,
					sortDir: this.currentSortDir === 'ASC' ? 'DESC' : 'ASC'
				});
			} else {
				// Else select the default sort for this field
				this.sortChange.emit({
					sortField: this.header.sortField,
					sortDir: this.header.sortDir
				});
			}
		}
	}
}
