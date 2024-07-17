import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	DestroyRef,
	Inject,
	Input,
	OnDestroy,
	OnInit,
	Optional,
	booleanAttribute,
	inject,
	input,
	signal
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { SortDir, SortDirection } from '../../../sorting.model';
import { AsySortDirective, AsySortable } from '../asy-sort.directive';

/** Column definition associated with a `AsySortHeader` */
interface AsySortHeaderColumnDef {
	name: string;
}

@Component({
	selector: 'asy-header-sort',
	templateUrl: './asy-header-sort.component.html',
	styleUrls: ['./asy-header-sort.component.scss'],
	// eslint-disable-next-line @angular-eslint/no-host-metadata-property
	host: {
		class: 'text-nowrap',
		'(click)': '_handleClick()',
		'[attr.aria-sort]': '_getAriaSortAttribute()'
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: []
})
export class AsyHeaderSortComponent implements AsySortable, OnDestroy, OnInit {
	readonly #destroyRef = inject(DestroyRef);
	readonly #changeDetectorRef = inject(ChangeDetectorRef);

	readonly isSorted = signal(false);

	/** The direction the arrow should be facing according to the current state. */
	readonly sortDir = signal<SortDir>(SortDirection.asc);

	/**
	 * ID of this sort header. If used within the context of a CdkColumnDef, this will default to
	 * the column's name.
	 */
	// eslint-disable-next-line @angular-eslint/no-input-rename
	@Input('sortId')
	id: string;

	/** Overrides the sort start value of the containing AsySort for this AsySortable. */
	readonly start = input<SortDir>();

	readonly sortable = input(true, { transform: booleanAttribute });

	constructor(
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

		this._sort
			.dataSource()
			.sortEvent$.pipe(takeUntilDestroyed(this.#destroyRef))
			.subscribe((sortChange) => {
				this.isSorted.set(sortChange.sortField === this.id);
				if (this.isSorted()) {
					this.sortDir.set(sortChange.sortDir);
				}
				this.#changeDetectorRef.markForCheck();
			});
	}

	ngOnDestroy() {
		this._sort.deregister(this);
	}

	_handleClick() {
		if (this.sortable()) {
			this._sort.sort({
				sortField: this.id,
				sortDir: this.getNextSortDirection(this.sortDir())
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
		if (!this.isSorted()) {
			return 'none';
		}

		return this._sort.dataSource().sortEvent$.value.sortDir === SortDirection.asc
			? 'ascending'
			: 'descending';
	}
}
