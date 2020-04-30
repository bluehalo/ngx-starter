import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { NgSelectModule } from '@ng-select/ng-select';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { DirectivesModule } from 'src/app/common/directives.module';
import { PagingModule } from 'src/app/common/paging.module';
import { PipesModule } from 'src/app/common/pipes.module';
import { SearchInputModule } from 'src/app/common/search-input.module';
import { SystemAlertModule } from 'src/app/common/system-alert.module';
import { CreateMessageComponent } from './create-message.component';
import { UpdateMessageComponent } from './edit-message.component';
import { ListMessagesComponent } from './list-messages.component';

@NgModule({
	imports: [
		BsDropdownModule.forRoot(),
		CommonModule,
		FormsModule,
		RouterModule,
		PagingModule,
		PipesModule,
		DirectivesModule,
		SystemAlertModule,
		SearchInputModule,
		NgSelectModule
	],
	exports: [],
	declarations: [UpdateMessageComponent, CreateMessageComponent, ListMessagesComponent],
	providers: []
})
export class AdminMessagesModule {}
