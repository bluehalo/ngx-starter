import { NgOptimizedImage } from '@angular/common';
import { Component, booleanAttribute, input, output } from '@angular/core';

import { AsyTableDataSource } from '../asy-table-data-source';
import { AsySkeletonRowsComponent } from '../skeleton-rows/asy-skeleton-rows.component';

@Component({
	selector: 'asy-table-empty-state',
	templateUrl: './asy-table-empty-state.component.html',
	styleUrls: ['./asy-table-empty-state.component.scss'],
	standalone: true,
	imports: [AsySkeletonRowsComponent, NgOptimizedImage]
})
export class AsyTableEmptyStateComponent<T> {
	readonly dataSource = input.required<AsyTableDataSource<T>>();
	readonly emptyText = input('No results are available.');
	readonly filteredText = input('No results matched your search.');
	readonly showClearFilters = input(true, { transform: booleanAttribute });
	readonly showIcons = input(true, { transform: booleanAttribute });

	readonly clearFilters = output();
}
