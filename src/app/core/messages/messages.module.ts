import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { PipesModule } from 'src/app/common/pipes.module';
import { SearchInputModule } from 'src/app/common/search-input.module';
import { SystemAlertModule } from 'src/app/common/system-alert.module';

import { ViewAllMessagesComponent } from './view-all-messages/view-all-messages.component';
import { RecentMessagesComponent } from './recent-messages/recent-messages.component';

import { MessagesRoutingModule } from './messages-routing.module';

@NgModule({
	imports: [
		CommonModule,
		PipesModule,
		MessagesRoutingModule,
		RouterModule,
		SystemAlertModule,
		SearchInputModule
	],
	exports: [RecentMessagesComponent],
	declarations: [ViewAllMessagesComponent, RecentMessagesComponent]
})
export class MessagesModule {}
