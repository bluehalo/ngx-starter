import { NgModule } from '@angular/core';

import { Pager } from './pager/pager.component';
import { PageableTable } from './pageable-table/pageable-table.component';

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
