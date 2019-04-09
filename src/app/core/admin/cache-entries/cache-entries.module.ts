import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ModalModule, TooltipModule } from 'ngx-bootstrap';

import { CacheEntryModalComponent } from './cache-entry-modal.component';
import { CacheEntriesService } from './cache-entries.service';
import { CacheEntriesComponent } from './cache-entries.component';

import { DirectivesModule } from '../../../common/directives.module';
import { PagingModule } from '../../../common/paging.module';
import { PipesModule } from '../../../common/pipes.module';
import { SystemAlertModule } from '../../../common/system-alert.module';
import { SearchInputModule } from '../../../common/search-input.module';

@NgModule({
	imports: [
		ModalModule.forRoot(),
		CommonModule,
		DirectivesModule,
		FormsModule,
		PagingModule,
		PipesModule,
		SystemAlertModule,
		SearchInputModule,
		TooltipModule
	],
	entryComponents: [
		CacheEntryModalComponent
	],
	declarations: [
		CacheEntriesComponent,
		CacheEntryModalComponent
	],
	exports: [
		CacheEntriesComponent
	],
	providers: [
		CacheEntriesService
	]
})
export class CacheEntriesModule { }

export { CacheEntriesComponent } from './cache-entries.component';
