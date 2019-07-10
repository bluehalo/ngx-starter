import { NgModule } from '@angular/core';
import { MessageService } from './message.service';
import { MessagesComponent } from './messages.component';
import { CommonModule } from '@angular/common';
import { SocketService } from '../socket.service';
import { PipesModule } from 'src/app/common/pipes.module';
import { AdminMessagesModule } from './admin/admin-messages.module';

@NgModule({
	imports: [
		CommonModule,
		PipesModule,
		AdminMessagesModule
	],
	exports: [
		MessagesComponent
	],
	declarations: [
		MessagesComponent
	],
	providers: [
		MessageService,
		SocketService
	]
})
export class MessagesModule {
}
