import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AlertModule } from 'ngx-bootstrap/alert';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { AdminCreateUserComponent } from './admin-create-user.component';
import { AdminListUsersComponent } from './admin-list-users.component';
import { AdminUpdateUserComponent } from './admin-edit-user.component';
import { AdminUsersService } from './admin-users.service';
import { DirectivesModule } from '../../../common/directives.module';
import { PipesModule } from '../../../common/pipes.module';
import { PagingModule } from '../../../common/paging.module';
import { SystemAlertModule } from '../../../common/system-alert.module';
import { SearchInputModule } from '../../../common/search-input.module';

@NgModule({
	imports: [
		AlertModule.forRoot(),
		ButtonsModule.forRoot(),
		BsDropdownModule.forRoot(),
		TooltipModule.forRoot(),

		CommonModule,
		DirectivesModule,
		FormsModule,
		PagingModule,
		PipesModule,
		RouterModule,
		SystemAlertModule,
		SearchInputModule
	],
	exports: [],
	entryComponents: [],
	declarations: [AdminCreateUserComponent, AdminListUsersComponent, AdminUpdateUserComponent],
	providers: [AdminUsersService]
})
export class AdminUserModule {}
