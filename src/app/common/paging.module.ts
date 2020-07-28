import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { DirectivesModule } from './directives.module';
import { PageableTableComponent } from './paging/pageable-table/pageable-table.component';
import { PagerComponent } from './paging/pager/pager.component';
import { QuickColumnToggleComponent } from './paging/quick-column-toggle/quick-column-toggle.component';
import { QuickFiltersComponent } from './paging/quick-filters/quick-filters.component';
import { SearchTableComponent } from './paging/search-table/search-table.component';
import { SortControlsComponent } from './paging/sort-controls/sort-controls.component';
import { SortableTableHeaderComponent } from './paging/sortable-table-header/sortable-table-header.component';
import { PipesModule } from './pipes.module';

@NgModule({
	imports: [CommonModule, FormsModule, DirectivesModule, TooltipModule, PipesModule],
	exports: [
		PagerComponent,
		PageableTableComponent,
		QuickColumnToggleComponent,
		QuickFiltersComponent,
		SearchTableComponent,
		SortControlsComponent,
		SortableTableHeaderComponent
	],
	declarations: [
		PagerComponent,
		PageableTableComponent,
		QuickColumnToggleComponent,
		QuickFiltersComponent,
		SearchTableComponent,
		SortControlsComponent,
		SortableTableHeaderComponent
	],
	providers: []
})
export class PagingModule {}

export { AbstractPageableDataComponent } from './paging/abstract-pageable-data-component';
export { PagerComponent, PagingComponent } from './paging/pager/pager.component';
export {
	PageChange,
	PagingOptions,
	PagingResults,
	NULL_PAGING_RESULTS
} from './paging/paging.model';
export { SortChange, SortDirection, SortDisplayOption } from './paging/sorting.model';
export {
	SortControlsComponent,
	TableSortOptions
} from './paging/sort-controls/sort-controls.component';
export {
	SortableTableHeaderComponent,
	SortableTableHeader
} from './paging/sortable-table-header/sortable-table-header.component';
export { QuickColumnToggleComponent } from './paging/quick-column-toggle/quick-column-toggle.component';
export { QuickFiltersComponent } from './paging/quick-filters/quick-filters.component';
export { SearchTableComponent } from './paging/search-table/search-table.component';
