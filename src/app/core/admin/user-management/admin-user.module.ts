import { CdkTableModule } from '@angular/cdk/table';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AlertModule } from 'ngx-bootstrap/alert';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { DirectivesModule } from '../../../common/directives.module';
import { PipesModule } from '../../../common/pipes.module';
import { SearchInputModule } from '../../../common/search-input.module';
import { SystemAlertModule } from '../../../common/system-alert.module';
import { TableModule } from '../../../common/table.module';
import { AdminCreateUserComponent } from './admin-create-user.component';
import { AdminEditUserComponent } from './admin-edit-user.component';
import { AdminUsersService } from './admin-users.service';
import { AdminListUsersComponent } from './list-users/admin-list-users.component';
import { UserRoleFilterDirective } from './list-users/user-role-filter.directive';

@NgModule({
	imports: [
		AlertModule.forRoot(),
		ButtonsModule.forRoot(),
		BsDropdownModule.forRoot(),
		TooltipModule.forRoot(),

		CommonModule,
		DirectivesModule,
		FormsModule,
		PipesModule,
		RouterModule,
		SystemAlertModule,
		SearchInputModule,
		CdkTableModule,
		TableModule
	],
	exports: [],
	declarations: [
		AdminCreateUserComponent,
		AdminListUsersComponent,
		AdminEditUserComponent,
		UserRoleFilterDirective
	],
	providers: [AdminUsersService]
})
export class AdminUserModule {}
