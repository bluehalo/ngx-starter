import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AlertModule, BsDropdownModule, ButtonsModule } from 'ngx-bootstrap';

import { AdminListUsersComponent } from './admin-list-users.component';
import { AdminUsersService } from './admin-users.service';
import { PipesModule } from '../../../common/pipes.module';
import { PagingModule } from '../../../common/paging.module';

@NgModule({
	imports: [
		AlertModule.forRoot(),
		BsDropdownModule.forRoot(),
		ButtonsModule.forRoot(),

		CommonModule,
		FormsModule,
		PagingModule,
		PipesModule,
		RouterModule
	],
	exports: [
	],
	entryComponents: [
	],
	declarations:   [
		AdminListUsersComponent
	],
	providers:  [
		AdminUsersService
	],
})
export class AdminUserModule { }
