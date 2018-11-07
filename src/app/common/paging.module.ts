import { NgModule } from '@angular/core';

import { PageableTableModule } from './paging/pageable-table.module';
import { SortControls } from './paging/sort-controls/sort-controls.component';
import { Pager, PagingOptions } from './paging/pager/pager.component';
import { SortDirection, SortDisplayOption } from './paging/sorting.model';

@NgModule({
	imports: [
		PageableTableModule
	],
	exports: [
		PageableTableModule,

		Pager,
		PagingOptions,

		SortControls,
		SortDirection,
		SortDisplayOption
	],
	declarations: [
		PageableTableModule,
		Pager,
		PagingOptions,

		SortControls,
		SortDirection,
		SortDisplayOption
	],
	providers: []
})
export class PagingModule { }

export { PageableTableModule } from './paging/pageable-table.module';
export { Pager, PagingOptions } from './paging/pager/pager.component';
export { SortDirection, SortDisplayOption } from './paging/sorting.model';
export { SortControls, TableSortOptions } from './paging/sort-controls/sort-controls.component';
