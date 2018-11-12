import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AdminUsersService } from '../user-management/admin-users.service';
import { EuaService } from './eua.service';
import { AdminListEuasComponent } from './admin-list-euas.component';
import { AdminCreateEuaComponent } from './admin-create-eua.component';
import { AdminUpdateEuaComponent } from './admin-edit-eua.component';

import { ModalModule, ModalService } from '../../../common/modal.module';
import { DirectivesModule } from '../../../common/directives.module';
import { PagingModule } from '../../../common/paging.module';
import { PipesModule } from '../../../common/pipes.module';

@NgModule({
	imports: [
		CommonModule,
		DirectivesModule,
		FormsModule,
		ModalModule,
		PagingModule,
		PipesModule,
		RouterModule
	],
	exports: [
	],
	entryComponents: [
	],
	declarations:   [
		AdminListEuasComponent,
		AdminCreateEuaComponent,
		AdminUpdateEuaComponent
	],
	providers:  [
		AdminUsersService,
		EuaService,
		ModalService
	]
})
export class AdminEuaModule { }

export { AdminListEuasComponent } from './admin-list-euas.component';
export { AdminCreateEuaComponent } from './admin-create-eua.component';
export { AdminUpdateEuaComponent } from './admin-edit-eua.component';
