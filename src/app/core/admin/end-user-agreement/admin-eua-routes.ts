import { Routes } from '@angular/router';

import { AdminCreateEuaComponent } from './admin-create-eua.component';
import { AdminUpdateEuaComponent } from './admin-edit-eua.component';
import { AdminListEuasComponent } from './list-euas/admin-list-euas.component';

export const ADMIN_EUA_ROUTES: Routes = [
	{
		path: 'euas',
		component: AdminListEuasComponent
	},
	{
		path: 'eua',
		component: AdminCreateEuaComponent
	},
	{
		path: 'eua/:id',
		component: AdminUpdateEuaComponent
	}
];
