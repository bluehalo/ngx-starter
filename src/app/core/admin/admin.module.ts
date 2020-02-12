import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { AdminUserModule } from './user-management/admin-user.module';
import { AdminEuaModule } from './end-user-agreement/admin-eua.module';
import { AdminFeedbackModule } from './feedback/admin-feedback.module';
import { AdminMessagesModule } from './messages/admin-messages.module';
import { CacheEntriesModule } from './cache-entries/cache-entries.module';

import { AdminComponent } from './admin.component';
import { AdminRoutingModule } from './admin-routing.module';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,

		// App Admin Modules
		AdminUserModule,
		AdminEuaModule,
		AdminFeedbackModule,
		CacheEntriesModule,
		AdminMessagesModule,

		AdminRoutingModule
	],
	exports: [],
	declarations: [AdminComponent]
})
export class AdminModule {}
export { AdminComponent } from './admin.component';
