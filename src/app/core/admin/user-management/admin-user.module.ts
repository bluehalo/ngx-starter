import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AlertModule, BsDropdownModule, ButtonsModule } from 'ngx-bootstrap';

import { AdminCreateUserComponent } from './admin-create-user.component';
import { AdminListUsersComponent } from './admin-list-users.component';
import { AdminUpdateUserComponent } from './admin-edit-user.component';
import { AdminUsersService } from './admin-users.service';
import { DirectivesModule } from '../../../common/directives.module';
import { PipesModule } from '../../../common/pipes.module';
import { PagingModule } from '../../../common/paging.module';
import { SystemAlertModule } from '../../../common/system-alert.module';

@NgModule({
	imports: [
		AlertModule.forRoot(),
		BsDropdownModule.forRoot(),
		ButtonsModule.forRoot(),

		CommonModule,
		DirectivesModule,
		FormsModule,
		PagingModule,
		PipesModule,
		RouterModule,
		SystemAlertModule
	],
	exports: [
	],
	entryComponents: [
	],
	declarations:   [
		AdminCreateUserComponent,
		AdminListUsersComponent,
		AdminUpdateUserComponent
	],
	providers:  [
		AdminUsersService
	],
})
export class AdminUserModule { }
