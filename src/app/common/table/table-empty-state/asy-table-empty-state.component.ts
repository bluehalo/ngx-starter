import { Component, EventEmitter, Input, Output } from '@angular/core';

import { AsyTableDataSource } from '../asy-table-data-source';

@Component({
	selector: 'asy-table-empty-state',
	templateUrl: './asy-table-empty-state.component.html',
	styleUrls: ['./asy-table-empty-state.component.scss']
})
export class AsyTableEmptyStateComponent<T> {
	@Input()
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
