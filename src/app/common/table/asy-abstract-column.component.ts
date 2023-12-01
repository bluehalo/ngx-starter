import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { CdkCellDef, CdkColumnDef, CdkHeaderCellDef, CdkTable } from '@angular/cdk/table';
import { Directive, Input, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';

@Directive()
export abstract class AsyAbstractColumnComponent<T> implements OnDestroy, OnInit {
	/** Column name that should be used to reference this column. */
	@Input()
	get name(): string {
		return this._name;
	}
	set name(name: string) {
		this._name = name;

		// With Ivy, inputs can be initialized before static query results are
		// available. In that case, we defer the synchronization until "ngOnInit" fires.
		this._syncColumnDefName();
	}
	_name: string;

	/**
	 * Whether this column should be sticky positioned on the front of the row.
	 */
	@Input('sticky')
	get sticky(): boolean {
		return this._stickyEnd;
	}
	set sticky(v: BooleanInput) {
		this._sticky = coerceBooleanProperty(v);
	}
	_sticky = false;

	/**
	 * Whether this column should be sticky positioned on the end of the row.
	 */
	@Input('stickyEnd')
	get stickyEnd(): boolean {
		return this._stickyEnd;
	}
	set stickyEnd(v: BooleanInput) {
		this._stickyEnd = coerceBooleanProperty(v);
	}
	_stickyEnd = false;

	/** @docs-private */
	@ViewChild(CdkColumnDef, { static: true }) columnDef: CdkColumnDef;

	/**
	 * The column cell is provided to the column during `ngOnInit` with a static query.
	 * Normally, this will be retrieved by the column using `ContentChild`, but that assumes the
	 * column definition was provided in the same view as the table, which is not the case with this
	 * component.
	 * @docs-private
	 */
	@ViewChild(CdkCellDef, { static: true }) cell: CdkCellDef;

	/**
	 * The column headerCell is provided to the column during `ngOnInit` with a static query.
	 * Normally, this will be retrieved by the column using `ContentChild`, but that assumes the
	 * column definition was provided in the same view as the table, which is not the case with this
	 * component.
	 * @docs-private
	 */
	@ViewChild(CdkHeaderCellDef, { static: true }) headerCell: CdkHeaderCellDef;

	// `AsyAbstractColumn` is always requiring a table, but we just assert it manually
	// for better error reporting.
	protected _table: CdkTable<T> = inject(CdkTable, { optional: true }) as CdkTable<T>;

	ngOnInit(): void {
		if (!this._table) {
			throw Error('column could not find a parent table for registration.');
		}
		this._syncColumnDefName();

		// Provide the cell and headerCell directly to the table with the static `ViewChild` query,
		// since the columnDef will not pick up its content by the time the table finishes checking
		// its content and initializing the rows.
		this.columnDef.cell = this.cell;
		this.columnDef.headerCell = this.headerCell;
		this._table.addColumnDef(this.columnDef);
	}

	ngOnDestroy() {
		this._table?.removeColumnDef(this.columnDef);
	}

	/** Synchronizes the column definition name with the text column name. */
	private _syncColumnDefName() {
		if (this.columnDef) {
			this.columnDef.name = this.name;
		}
	}
}
