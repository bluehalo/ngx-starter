import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { AuthGuard } from '../auth/auth.guard';
import { AdminComponent } from './admin.component';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminUserModule } from './user-management/admin-user.module';
import { PagingModule } from '../../common/paging.module';

@NgModule({
	imports: [
		AdminRoutingModule,

		// App Admin Modules
		AdminUserModule,

		CommonModule,
		FormsModule,
		PagingModule
	],
	exports: [],
	declarations:   [
		AdminComponent
	],
	providers:  [
		AuthGuard
	]
})
export class AdminModule { }
