import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

/**
 * Admin management of users
 */
@Injectable({
	providedIn: 'root'
})
export class ExportConfigService {
	constructor(private http: HttpClient) {}

	postExportConfig(type: string, config: any): Observable<any> {
		return this.http.post('/api/requestExport', JSON.stringify({ type, config }), {
			headers: { 'Content-Type': 'application/json' }
		});
	}
}
