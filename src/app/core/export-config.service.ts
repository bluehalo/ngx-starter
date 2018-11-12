import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

@Injectable()
/**
 * Admin management of users
 */
export class ExportConfigService {

	constructor(private http: HttpClient) {}

	postExportConfig(type: string, config: any): Observable<any> {
		return this.http.post(
			'/api/requestExport',
			JSON.stringify({ type: type, config: config }),
			{ headers: { 'Content-Type': 'application/json'	} }
		);
	}
}
