import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

export interface SortableTableHeader {
	name: string;
	sortField?: string;
	sortDir?: string;
	sortable: boolean;
	default?: boolean;
	tooltip?: string;
}
@Component({
	selector: 'sortable-table-header',
	templateUrl: 'sortable-table-header.component.html',
	styleUrls: [ 'sortable-table-header.component.scss' ]
})
export class SortableTableHeaderComponent implements OnInit {

	@Input() header: any;

	@Input() showSort = true;

	@Input() currentSortField: string;

	@Input() currentSortDir: string;

	@Output() onSortChange = new EventEmitter<any>();

	sortable: boolean;

	ngOnInit() {
		this.sortable = this.header.sortable && this.showSort;
	}

	sort() {
		if (this.sortable) {
			// If this header is the currently sorted field, reverse the sort
			if (this.header.sortField === this.currentSortField) {
				this.onSortChange.emit({ sortField: this.header.sortField, sortDir: this.currentSortDir === 'ASC' ? 'DESC' : 'ASC' } );
			}
			else {
				// Else select the default sort for this field
				this.onSortChange.emit({ sortField: this.header.sortField, sortDir: this.header.sortDir } );
			}
		}
	}
}
