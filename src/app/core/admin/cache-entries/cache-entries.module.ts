import { CdkTableModule } from '@angular/cdk/table';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule as BsModalModule } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { DirectivesModule } from '../../../common/directives.module';
import { ModalModule } from '../../../common/modal.module';
import { PipesModule } from '../../../common/pipes.module';
import { SearchInputModule } from '../../../common/search-input.module';
import { SystemAlertModule } from '../../../common/system-alert.module';
import { TableModule } from '../../../common/table.module';
import { CacheEntriesComponent } from './cache-entries.component';
import { CacheEntriesService } from './cache-entries.service';
import { CacheEntryModalComponent } from './cache-entry-modal.component';

@NgModule({
	imports: [
		BsDropdownModule,
		BsModalModule,
		CommonModule,
		DirectivesModule,
		FormsModule,
		PipesModule,
		SystemAlertModule,
		SearchInputModule,
		TooltipModule,
		ModalModule,
		CdkTableModule,
		TableModule
	],
	declarations: [CacheEntriesComponent, CacheEntryModalComponent],
	exports: [CacheEntriesComponent],
	providers: [CacheEntriesService]
})
export class CacheEntriesModule {}
