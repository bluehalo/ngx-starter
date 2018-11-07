import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { AdminComponent } from './admin.component';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminUserModule } from './user-management/admin-user.module';

@NgModule({
	imports: [
		AdminRoutingModule,

		// App Admin Modules
		AdminUserModule,

		CommonModule,
		FormsModule
	],
	exports: [],
	declarations:   [
		AdminComponent
	],
	providers:  [
	]
})
export class AdminModule { }
