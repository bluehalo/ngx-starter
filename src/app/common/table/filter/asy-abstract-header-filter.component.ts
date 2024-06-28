import {
	AfterViewInit,
	ChangeDetectorRef,
	Directive,
	HostListener,
	Input,
	OnDestroy,
	OnInit,
	inject,
	signal
} from '@angular/core';

import isEmpty from 'lodash/isEmpty';

import { SessionStorageService } from '../../storage/session-storage.service';
import { AsyFilterDirective, AsyFilterable } from './asy-filter.directive';

/** Column definition associated with a `AsySortHeader` */
export interface AsyFilterHeaderColumnDef {
	name: string;
}

@Directive({ standalone: true })
export abstract class AsyAbstractHeaderFilterComponent
	implements AsyFilterable, AfterViewInit, OnDestroy, OnInit
{
	#storage = new SessionStorageService();

	/**
	 * ID of this sort header. If used within the context of a CdkColumnDef, this will default to
	 * the column's name.
	 */
	// eslint-disable-next-line @angular-eslint/no-input-rename
	@Input('filter-field') id: string;

	// `AsyFilterDirective` is not optionally injected, but just asserted manually w/ better error.
	protected _filter = inject(AsyFilterDirective, { optional: true }) as AsyFilterDirective;

	protected changeDetectorRef = inject(ChangeDetectorRef);

	readonly isFiltered = signal(false);
	readonly isOpen = signal(false);

	protected constructor(public _columnDef: AsyFilterHeaderColumnDef) {}

	abstract _buildFilter(): any;
	abstract _buildState(): any;
	abstract _clearState(): void;
	abstract _restoreState(state: any): void;

	ngOnInit(): void {
		if (!this._filter) {
			throw Error(
				'Header filter could not find a parent AsyFilterDirective for registration.'
			);
		}
		if (!this.id && this._columnDef) {
			this.id = this._columnDef.name;
		}
		this._filter.register(this);
	}

	ngAfterViewInit() {
		this._restoreState(this.loadState());
	}

	ngOnDestroy() {
		this._filter?.deregister(this);
	}

	toggle() {
		this.isOpen.set(!this.isOpen());
	}

	onFilterChange() {
		const filter = this._buildFilter();
		this.isFiltered.set(!isEmpty(filter));
		this._filter.filter(this.id, filter);
		this.changeDetectorRef.markForCheck();
		this.saveState();
	}

	clearFilter() {
		this.isFiltered.set(false);
		this._clearState();
		this.onFilterChange();
	}

	loadState(): any {
		const storageKey = this._filter.dataSource().storageKey;
		if (storageKey) {
			return this.#storage.getValue(`${storageKey}-${this.id}-filter`);
		}
		return undefined;
	}

	saveState() {
		const storageKey = this._filter.dataSource().storageKey;
		if (storageKey) {
			this.#storage.setValue(`${storageKey}-${this.id}-filter`, this._buildState());
		}
	}

	/**
	 * Stop click event propagation to prevent sorting from being updated
	 */
	@HostListener('click', ['$event'])
	_handleClick(event: Event) {
		event.stopPropagation();
	}
}
