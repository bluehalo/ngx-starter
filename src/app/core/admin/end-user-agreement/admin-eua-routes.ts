import { Routes } from '@angular/router';

import { euaResolver } from './eua.service';
import { AdminListEuasComponent } from './list-euas/admin-list-euas.component';
import { ManageEuaComponent } from './manage-eua/manage-eua.component';

export const ADMIN_EUA_ROUTES: Routes = [
	{
		path: 'euas',
		component: AdminListEuasComponent
	},
	{
		path: 'eua',
		component: ManageEuaComponent
	},
	{
		path: 'eua/:id',
		resolve: {
			eua: euaResolver
		},
		component: ManageEuaComponent
	}
];
