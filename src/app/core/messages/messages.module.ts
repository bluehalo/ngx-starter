import { NgModule } from '@angular/core';
import { MessageService } from './message.service';
import { CommonModule } from '@angular/common';
import { SocketService } from '../socket.service';
import { PipesModule } from 'src/app/common/pipes.module';
import { AdminMessagesModule } from './admin/admin-messages.module';
import { ViewAllMessagesComponent } from './view-all-messages/view-all-messages.component';
import { MessagesRoutingModule } from './messages-routing.module';
import { RouterModule } from '@angular/router';
import { SystemAlertModule } from 'src/app/common/system-alert.module';
import { RecentMessagesComponent } from './recent-messages/recent-messages.component';
import { SearchInputModule } from 'src/app/common/search-input.module';

@NgModule({
	imports: [
		CommonModule,
		PipesModule,
		AdminMessagesModule,
		MessagesRoutingModule,
		RouterModule,
		SystemAlertModule,
		SearchInputModule
	],
	exports: [
		RecentMessagesComponent
	],
	declarations: [
		ViewAllMessagesComponent,
		RecentMessagesComponent
	],
	providers: [
		MessageService,
		SocketService
	]
})
export class MessagesModule {
}
