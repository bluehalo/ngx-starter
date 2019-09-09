import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ListAuditEntriesComponent } from './list-audit-entries/list-audit-entries.component';
import { AuthGuard } from '../auth/auth.guard';

@NgModule({
	imports: [
		RouterModule.forChild([
			{
				path: 'audit',
				component: ListAuditEntriesComponent,
				canActivate: [AuthGuard],
				data: { roles: [ 'auditor' ] }
			}])
	],
	exports: [
		RouterModule
	]
})
export class AuditRoutingModule { }
