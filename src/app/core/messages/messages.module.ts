import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PipesModule } from '../../common/pipes.module';
import { SearchInputModule } from '../../common/search-input.module';
import { SystemAlertModule } from '../../common/system-alert.module';
import { MessagesRoutingModule } from './messages-routing.module';
import { RecentMessagesComponent } from './recent-messages/recent-messages.component';
import { ViewAllMessagesComponent } from './view-all-messages/view-all-messages.component';

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
