import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { AsyTableDataSource } from '../asy-table-data-source';
import { AsySkeletonRowsComponent } from '../skeleton-rows/asy-skeleton-rows.component';

@Component({
	selector: 'asy-table-empty-state',
	templateUrl: './asy-table-empty-state.component.html',
	styleUrls: ['./asy-table-empty-state.component.scss'],
	standalone: true,
	imports: [NgIf, AsySkeletonRowsComponent]
})
export class AsyTableEmptyStateComponent<T> {
	@Input({ required: true })
	dataSource: AsyTableDataSource<T>;

	@Input()
	emptyText = 'No results are available.';

	@Input()
	filteredText = 'No results matched your search.';

	@Input()
	showClearFilters = true;

	@Input()
	showIcons = true;

	@Output()
	readonly clearFilters = new EventEmitter();
}
