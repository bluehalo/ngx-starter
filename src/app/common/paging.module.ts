import { NgModule } from '@angular/core';

import { PageableTableModule, TableSortOptions } from './paging/pageable-table.module';
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

		SortDirection,
		SortDisplayOption
	],
	declarations: [
		PageableTableModule,
		Pager,
		PagingOptions,

		SortDirection,
		SortDisplayOption
	],
	providers: []
})
export class PagingModule { }

export { PageableTableModule, TableSortOptions } from './paging/pageable-table.module';
export { Pager, PagingOptions } from './paging/pager/pager.component';
export { SortDirection, SortDisplayOption } from './paging/sorting.model';
