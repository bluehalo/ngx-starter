import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { PipesModule } from './pipes.module';
import { DirectivesModule } from './directives.module';
import { SortControls, TableSortOptions } from './paging/sort-controls/sort-controls.component';
import { SortableTableHeader, SortableTableHeaderComponent } from './paging/sortable-table-header/sortable-table-header.component';
import { Pager } from './paging/pager/pager.component';
import { PageableTable } from './paging/pageable-table/pageable-table.component';
import { QuickColumnToggleComponent } from './paging/quick-column-toggle/quick-column-toggle.component';
import { QuickFiltersComponent } from './paging/quick-filters/quick-filters.component';
import { SearchTableComponent } from './paging/search-table/search-table.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		DirectivesModule,
		TooltipModule,
		PipesModule
	],
	exports: [
		Pager,
		PageableTable,
		QuickColumnToggleComponent,
		QuickFiltersComponent,
		SearchTableComponent,
		SortControls,
		SortableTableHeaderComponent
	],
	declarations: [
		Pager,
		PageableTable,
		QuickColumnToggleComponent,
		QuickFiltersComponent,
		SearchTableComponent,
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
export { QuickColumnToggleComponent } from './paging/quick-column-toggle/quick-column-toggle.component';
export { QuickFiltersComponent } from './paging/quick-filters/quick-filters.component';
export { SearchTableComponent } from './paging/search-table/search-table.component';

