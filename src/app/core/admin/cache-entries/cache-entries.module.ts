import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { DirectivesModule } from '../../../common/directives.module';
import { ModalModule } from '../../../common/modal.module';
import { PagingModule } from '../../../common/paging.module';
import { PipesModule } from '../../../common/pipes.module';
import { SearchInputModule } from '../../../common/search-input.module';
import { SystemAlertModule } from '../../../common/system-alert.module';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule as BsModalModule } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { CacheEntriesComponent } from './cache-entries.component';
import { CacheEntriesService } from './cache-entries.service';
import { CacheEntryModalComponent } from './cache-entry-modal.component';

@NgModule({
	imports: [
		BsDropdownModule.forRoot(),
		BsModalModule.forRoot(),
		CommonModule,
		DirectivesModule,
		FormsModule,
		PagingModule,
		PipesModule,
		SystemAlertModule,
		SearchInputModule,
		TooltipModule,
		ModalModule
	],
	declarations: [CacheEntriesComponent, CacheEntryModalComponent],
	exports: [CacheEntriesComponent],
	providers: [CacheEntriesService]
})
export class CacheEntriesModule {}

export { CacheEntriesComponent } from './cache-entries.component';
