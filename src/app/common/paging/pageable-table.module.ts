import { NgModule } from '@angular/core';

import { Pager } from './pager/pager.component';
import { PageableTable } from './pageable-table/pageable-table.component';
import { PipesModule } from '../pipes.module';

@NgModule({
	imports: [
		PipesModule
	],
	exports: [
		PageableTable
	],
	declarations: [
		PageableTable
	]
})
export class PageableTableModule {}
