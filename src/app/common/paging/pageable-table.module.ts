import { NgModule } from '@angular/core';

import { PageableTable, TableSortOptions } from './pageable-table/pageable-table.component';

@NgModule({
	imports: [],
	exports: [
		PageableTable
	],
	declarations: [
		PageableTable
	]
})
export class PageableTableModule {}

export { TableSortOptions } from './pageable-table/pageable-table.component';
