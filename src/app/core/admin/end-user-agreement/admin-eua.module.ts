import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

import { AdminUsersService } from '../user-management/admin-users.service';
import { EuaService } from './eua.service';
import { AdminListEuasComponent } from './admin-list-euas.component';
import { AdminCreateEuaComponent } from './admin-create-eua.component';
import { AdminUpdateEuaComponent } from './admin-edit-eua.component';

import { ModalModule, ModalService } from '../../../common/modal.module';
import { DirectivesModule } from '../../../common/directives.module';
import { PagingModule } from '../../../common/paging.module';
import { PipesModule } from '../../../common/pipes.module';
import { SystemAlertModule } from '../../../common/system-alert.module';
import { SearchInputModule } from '../../../common/search-input.module';

@NgModule({
	imports: [
		BsDropdownModule.forRoot(),
		CommonModule,
		DirectivesModule,
		FormsModule,
		ModalModule,
		PagingModule,
		PipesModule,
		RouterModule,
		SystemAlertModule,
		SearchInputModule
	],
	exports: [],
	declarations: [AdminListEuasComponent, AdminCreateEuaComponent, AdminUpdateEuaComponent],
	providers: [AdminUsersService, EuaService, ModalService]
})
export class AdminEuaModule {}

export { AdminListEuasComponent } from './admin-list-euas.component';
export { AdminCreateEuaComponent } from './admin-create-eua.component';
export { AdminUpdateEuaComponent } from './admin-edit-eua.component';
