import { authGuard } from '../auth';
import { AuditService } from './audit.service';
import { ListAuditEntriesComponent } from './list-audit-entries/list-audit-entries.component';

export const AUDIT_ROUTES = [
	{
		path: '',
		component: ListAuditEntriesComponent,
		canActivate: [authGuard('auditor')],
		providers: [AuditService]
	}
];
