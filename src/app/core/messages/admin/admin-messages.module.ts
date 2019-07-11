import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CreateMessageComponent } from './create-message.component';
import { ListMessagesComponent } from './list-messages.component';
import { AdminMessagesRoutingModule } from './admin-messages-routing.module';
import { UpdateMessageComponent } from './edit-message.component';
import { PagingModule } from 'src/app/common/paging.module';
import { PipesModule } from 'src/app/common/pipes.module';
import { DirectivesModule } from 'src/app/common/directives.module';
import { SystemAlertModule } from 'src/app/common/system-alert.module';
import { SearchInputModule } from 'src/app/common/search-input.module';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
	imports: [
		AdminMessagesRoutingModule,
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
	declarations: [
		UpdateMessageComponent,
		CreateMessageComponent,
		ListMessagesComponent
	],
	providers: [
	]
})
export class AdminMessagesModule {
}
