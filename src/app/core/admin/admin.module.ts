import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { AuthGuard } from '../auth/auth.guard';
import { AdminComponent } from './admin.component';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminUserModule } from './user-management/admin-user.module';
import { AdminEuaModule } from './end-user-agreement/admin-eua.module';
import { CacheEntriesModule } from './cache-entries/cache-entries.module';
import { PagingModule } from '../../common/paging.module';

import { AdminTopics } from './admin-topic.model';

@NgModule({
	imports: [
		AdminRoutingModule,

		// App Admin Modules
		AdminUserModule,
		AdminEuaModule,
		CacheEntriesModule,

		CommonModule,
		FormsModule,
		PagingModule
	],
	exports: [],
	declarations: [AdminComponent],
	providers: [AdminTopics, AuthGuard]
})
export class AdminModule {}
export { AdminTopic, AdminTopics } from './admin-topic.model';
export { AdminComponent } from './admin.component';
