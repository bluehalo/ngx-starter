import {
	AfterViewInit,
	ChangeDetectorRef,
	Directive,
	HostListener,
	inject,
	Input,
	OnDestroy,
	OnInit
} from '@angular/core';

import isEmpty from 'lodash/isEmpty';

import { SessionStorageService } from '../../storage/session-storage.service';
import { AsyFilterable, AsyFilterDirective } from './asy-filter.directive';

/** Column definition associated with a `AsySortHeader` */
export interface AsyFilterHeaderColumnDef {
	name: string;
}

@Directive()
export abstract class AsyAbstractHeaderFilterComponent
	implements AsyFilterable, AfterViewInit, OnDestroy, OnInit
{
	@Input()
	dropdownMenuRight = false;

	isFiltered = false;

	private storage = new SessionStorageService();

	/**
	 * ID of this sort header. If used within the context of a CdkColumnDef, this will default to
	 * the column's name.
	 */
	// eslint-disable-next-line @angular-eslint/no-input-rename
	@Input('filter-field') id: string;

	// `AsyFilterDirective` is not optionally injected, but just asserted manually w/ better error.
	protected _filter = inject(AsyFilterDirective, { optional: true }) as AsyFilterDirective;

	protected changeDetectorRef = inject(ChangeDetectorRef);

	abstract _buildFilter(): any;
	abstract _buildState(): any;
	abstract _clearState(): void;
	abstract _restoreState(state: any): void;

	protected constructor(public _columnDef: AsyFilterHeaderColumnDef) {}

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

	onFilterChange() {
		const filter = this._buildFilter();
		this.isFiltered = !isEmpty(filter);
		this._filter.filter(this.id, filter);
		this.changeDetectorRef.markForCheck();
		this.saveState();
	}

	clearFilter() {
		this.isFiltered = false;
		this._clearState();
		this.onFilterChange();
	}

	loadState(): any {
		const storageKey = this._filter.dataSource.storageKey;
		if (storageKey) {
			return this.storage.getValue(`${this._filter.dataSource.storageKey}-${this.id}-filter`);
		}
		return undefined;
	}

	saveState() {
		const storageKey = this._filter.dataSource.storageKey;
		if (storageKey) {
			this.storage.setValue(
				`${this._filter.dataSource.storageKey}-${this.id}-filter`,
				this._buildState()
			);
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
