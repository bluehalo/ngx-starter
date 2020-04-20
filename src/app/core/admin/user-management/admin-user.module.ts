import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AlertModule } from 'ngx-bootstrap/alert';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { DirectivesModule } from '../../../common/directives.module';
import { PagingModule } from '../../../common/paging.module';
import { PipesModule } from '../../../common/pipes.module';
import { SearchInputModule } from '../../../common/search-input.module';
import { SystemAlertModule } from '../../../common/system-alert.module';
import { AdminCreateUserComponent } from './admin-create-user.component';
import { AdminUpdateUserComponent } from './admin-edit-user.component';
import { AdminListUsersComponent } from './admin-list-users.component';
import { AdminUsersService } from './admin-users.service';

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
	declarations: [AdminCreateUserComponent, AdminListUsersComponent, AdminUpdateUserComponent],
	providers: [AdminUsersService]
})
export class AdminUserModule {}
