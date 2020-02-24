import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { AdminModule as CommonAdminModule } from '../../common/admin.module';
import { AdminUserModule } from './user-management/admin-user.module';
import { AdminEuaModule } from './end-user-agreement/admin-eua.module';
import { AdminFeedbackModule } from './feedback/admin-feedback.module';
import { AdminMessagesModule } from './messages/admin-messages.module';
import { CacheEntriesModule } from './cache-entries/cache-entries.module';

import { AdminRoutingModule } from './admin-routing.module';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,

		CommonAdminModule,

		// App Admin Modules
		AdminUserModule,
		AdminEuaModule,
		AdminFeedbackModule,
		CacheEntriesModule,
		AdminMessagesModule,

		AdminRoutingModule
	],
	exports: []
})
export class AdminModule {}
