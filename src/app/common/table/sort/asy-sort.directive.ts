import { Directive, Input } from '@angular/core';

import { SortChange } from '../../sorting.model';
import { AsyTableDataSource } from '../asy-table-data-source';

/** Interface for a directive that holds sorting state consumed by `AsySortHeader`. */
export interface AsySortable {
	/** The id of the column being sorted. */
	id: string;
}

@Directive({
	selector: '[asySort]',
	exportAs: 'asySort',
	// eslint-disable-next-line @angular-eslint/no-host-metadata-property
	host: { class: 'asy-sort' },
	standalone: true
})
export class AsySortDirective {
	/** Collection of all registered sortables that this directive manages. */
	sortables = new Map<string, AsySortable>();

	@Input()
	dataSource: AsyTableDataSource<any>;

	/**
	 * Register function to be used by the contained AsySortables. Adds the AsySortable to the
	 * collection of AsySortables.
	 */
	register(sortable: AsySortable): void {
		if (!sortable.id) {
			throw Error(`AsySortHeaderComponent must be provided with a unique id.`);
		}

		if (this.sortables.has(sortable.id)) {
			throw Error(`Cannot have two AsySortables with the same id (${sortable.id}).`);
		}

		this.sortables.set(sortable.id, sortable);
	}

	/**
	 * Unregister function to be used by the contained AsySortables. Removes the AsySortable from the
	 * collection of contained AsySortables.
	 */
	deregister(sortable: AsySortable): void {
		this.sortables.delete(sortable.id);
	}

	constructor() {
		// do nothing
	}

	sort(sortChange: SortChange): void {
		this.dataSource.sort(sortChange);
	}
}
