import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListAuditEntriesComponent } from '../audit/list-audit-entries/list-audit-entries.component';
import { AuthGuard } from '../auth/auth.guard';
import { UserPreferenceComponent } from './user-preference/user-preference.component';

@NgModule({
	imports: [
		RouterModule.forChild([
			{
				path: 'userPreference',
				component: UserPreferenceComponent,
				canActivate: [AuthGuard]
				// data: { roles: ['admin'] },
			}
		])
	]
})
export class UserRoutingModule {}
