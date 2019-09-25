import { Component, Input, Output, EventEmitter } from '@angular/core';

import { KeysPipe } from '../../pipes.module';
import { SortDirection, SortDisplayOption } from '../sorting.model';

export interface TableSortOptions {
	[name: string]: SortDisplayOption;
}

@Component({
	selector: 'sort-controls',
	templateUrl: 'sort-controls.component.html'
})
export class SortControls {

	@Input() showHeader = true;

	@Input() showDirectionControl = false;

	@Input()
	set selectedSort(sort: any) {
		this.selectedKey = sort.sortField;
		this.selectedDir = sort.sortDir;
	}

	@Input() sortOptions: TableSortOptions;

	@Output() readonly onSortChange = new EventEmitter<SortDisplayOption>();

	private selectedKey: string;

	private selectedDir: SortDirection;

	updateSort(key: string) {
		// If the sort type changed, update
		if (this.selectedKey !== this.sortOptions[key].sortField) {
			this.selectedKey = this.sortOptions[key].sortField as string;
			this.selectedDir = this.sortOptions[key].sortDir;
			this.onSortChange.emit(this.sortOptions[key]);

		// Otherwise, toggle the sort direction (if direction controls are enabled)
		} else if (this.showDirectionControl) {
			this.selectedDir = this.selectedDir === SortDirection.desc ? SortDirection.asc : SortDirection.desc;
			this.sortOptions[key].sortDir = this.selectedDir;
			this.onSortChange.emit(this.sortOptions[key]);
		}
	}
}
