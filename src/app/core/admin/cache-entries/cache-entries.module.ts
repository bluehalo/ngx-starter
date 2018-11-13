import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ModalModule } from 'ngx-bootstrap';

import { CacheEntryModalComponent } from './cache-entry-modal.component';
import { CacheEntriesService } from './cache-entries.service';
import { CacheEntriesComponent } from './cache-entries.component';

import { DirectivesModule } from '../../../common/directives.module';
import { PagingModule } from '../../../common/paging.module';
import { PipesModule } from '../../../common/pipes.module';

@NgModule({
	imports: [
		ModalModule.forRoot(),
		CommonModule,
		DirectivesModule,
		FormsModule,
		PagingModule,
		PipesModule
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
