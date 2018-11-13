import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TooltipModule } from 'ngx-bootstrap';

import { SortControls, TableSortOptions } from './paging/sort-controls/sort-controls.component';
import { SortableTableHeader, SortableTableHeaderComponent } from './paging/sortable-table-header/sortable-table-header.component';
import { Pager } from './paging/pager/pager.component';
import { PageableTable } from './paging/pageable-table/pageable-table.component';
import { PipesModule } from './pipes.module';
import { DirectivesModule } from './directives.module';

@NgModule({
	imports: [
		CommonModule,
		DirectivesModule,
		PipesModule,
		TooltipModule
	],
	exports: [
		Pager,
		PageableTable,
		SortControls,
		SortableTableHeaderComponent
	],
	declarations: [
		Pager,
		PageableTable,
		SortControls,
		SortableTableHeaderComponent
	],
	providers: []
})
export class PagingModule { }

export { Pager, PageChange, PagingOptions, PagingComponent, PagingResults, NULL_PAGING_RESULTS } from './paging/pager/pager.component';
export { SortDirection, SortDisplayOption } from './paging/sorting.model';
export { SortControls, TableSortOptions } from './paging/sort-controls/sort-controls.component';
export { SortableTableHeaderComponent, SortableTableHeader } from './paging/sortable-table-header/sortable-table-header.component';
