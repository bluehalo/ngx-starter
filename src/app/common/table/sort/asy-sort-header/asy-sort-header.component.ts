import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	Inject,
	Input,
	OnDestroy,
	OnInit,
	Optional
} from '@angular/core';

import { Subscription } from 'rxjs';

import { SortDir, SortDirection } from '../../../sorting.model';
import { AsySortable, AsySortDirective } from '../asy-sort.directive';

/** Column definition associated with a `AsySortHeader` */
interface AsySortHeaderColumnDef {
	name: string;
}

@Component({
	selector: '[asy-sort-header]',
	templateUrl: './asy-sort-header.component.html',
	styleUrls: ['./asy-sort-header.component.scss'],
	// eslint-disable-next-line @angular-eslint/no-host-metadata-property
	host: {
		class: 'asy-sort-header',
		'(click)': '_handleClick()',
		'[class.asy-sort-header-sorted]': 'isSorted',
		'[attr.aria-sort]': '_getAriaSortAttribute()'
	},
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AsySortHeaderComponent implements AsySortable, OnDestroy, OnInit {
	/** The direction the arrow should be facing according to the current state. */
	sortDir: SortDir = SortDirection.asc;

	isSorted = false;

	private _rerenderSubscription: Subscription;

	/**
	 * ID of this sort header. If used within the context of a CdkColumnDef, this will default to
	 * the column's name.
	 */
	@Input('asy-sort-header') id: string;

	/** Overrides the sort start value of the containing AsySort for this AsySortable. */
	@Input() start: SortDir;

	@Input() sortable = true;

	constructor(
		private changeDetectorRef: ChangeDetectorRef,
		// `AsySortDirective` is not optionally injected, but just asserted manually w/ better error.
		@Optional()
		public _sort: AsySortDirective,
		@Inject('MAT_SORT_HEADER_COLUMN_DEF')
		@Optional()
		public _columnDef: AsySortHeaderColumnDef
	) {
		if (!_sort) {
			throw Error(
				`AsySortHeaderComponent must be placed within a parent element with the AsySortDirective directive.`
			);
		}
	}

	ngOnInit(): void {
		if (!this.id && this._columnDef) {
			this.id = this._columnDef.name;
		}
		this._sort.register(this);

		this._rerenderSubscription = this._sort.dataSource.sortEvent$.subscribe((sortChange) => {
			this.isSorted = sortChange.sortField === this.id;
			if (this.isSorted) {
				this.sortDir = sortChange.sortDir;
			}
			this.changeDetectorRef.markForCheck();
		});
	}

	ngOnDestroy() {
		this._sort.deregister(this);
		this._rerenderSubscription?.unsubscribe();
	}

	_handleClick() {
		if (this.sortable) {
			this._sort.sort({
				sortField: this.id,
				sortDir: this.getNextSortDirection(this.sortDir)
			});
		}
	}

	getNextSortDirection(direction: SortDir): SortDir {
		if (direction === SortDirection.asc) {
			return SortDirection.desc;
		}
		return SortDirection.asc;
	}

	/**
	 * Gets the aria-sort attribute that should be applied to this sort header. If this header
	 * is not sorted, returns null so that the attribute is removed from the host element. Aria spec
	 * says that the aria-sort property should only be present on one header at a time, so removing
	 * ensures this is true.
	 */
	_getAriaSortAttribute() {
		if (!this.isSorted) {
			return 'none';
		}

		return this._sort.dataSource.sortEvent$.value.sortDir === SortDirection.asc
			? 'ascending'
			: 'descending';
	}
}
