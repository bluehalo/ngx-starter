import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TooltipModule } from 'ngx-bootstrap';

import { SortControls } from './paging/sort-controls/sort-controls.component';
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
	],
	declarations: [
		Pager,
		PageableTable,
		SortControls,
	],
	providers: []
})
export class PagingModule { }

export { Pager, PageChange, PagingOptions } from './paging/pager/pager.component';
export { SortDirection, SortDisplayOption } from './paging/sorting.model';
