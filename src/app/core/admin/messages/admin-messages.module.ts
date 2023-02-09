import { CdkTableModule } from '@angular/cdk/table';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { NgSelectModule } from '@ng-select/ng-select';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

import { DirectivesModule } from '../../../common/directives.module';
import { PipesModule } from '../../../common/pipes.module';
import { SearchInputModule } from '../../../common/search-input.module';
import { SystemAlertModule } from '../../../common/system-alert.module';
import { TableModule } from '../../../common/table.module';
import { CreateMessageComponent } from './create-message.component';
import { UpdateMessageComponent } from './edit-message.component';
import { ListMessagesComponent } from './list-messages/list-messages.component';

@NgModule({
	imports: [
		BsDropdownModule.forRoot(),
		CommonModule,
		FormsModule,
		RouterModule,
		PipesModule,
		DirectivesModule,
		SystemAlertModule,
		SearchInputModule,
		NgSelectModule,
		CdkTableModule,
		TableModule
	],
	exports: [],
	declarations: [UpdateMessageComponent, CreateMessageComponent, ListMessagesComponent]
})
export class AdminMessagesModule {}
