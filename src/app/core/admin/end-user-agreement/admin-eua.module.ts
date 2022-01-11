import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

import { DirectivesModule } from '../../../common/directives.module';
import { ModalModule, ModalService } from '../../../common/modal.module';
import { PagingModule } from '../../../common/paging.module';
import { PipesModule } from '../../../common/pipes.module';
import { SearchInputModule } from '../../../common/search-input.module';
import { SystemAlertModule } from '../../../common/system-alert.module';
import { AdminUsersService } from '../user-management/admin-users.service';
import { AdminCreateEuaComponent } from './admin-create-eua.component';
import { AdminUpdateEuaComponent } from './admin-edit-eua.component';
import { AdminListEuasComponent } from './admin-list-euas.component';
import { EuaService } from './eua.service';

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
