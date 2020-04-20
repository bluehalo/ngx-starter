import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthGuard } from '../auth/auth.guard';
import { ListAuditEntriesComponent } from './list-audit-entries/list-audit-entries.component';

@NgModule({
	imports: [
		RouterModule.forChild([
			{
				path: '',
				component: ListAuditEntriesComponent,
				canActivate: [AuthGuard],
				data: { roles: ['auditor'] }
			}
		])
	],
	exports: [RouterModule]
})
export class AuditRoutingModule {}
