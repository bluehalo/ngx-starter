import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { Observable } from 'rxjs';

/**
 * Admin management of users
 */
@Injectable({
	providedIn: 'root'
})
export class ExportConfigService {
	readonly #http = inject(HttpClient);

	postExportConfig(type: string, config: unknown): Observable<{ _id: string }> {
		return this.#http.post<{ _id: string }>(
			'/api/requestExport',
			JSON.stringify({ type, config }),
			{
				headers: { 'Content-Type': 'application/json' }
			}
		);
	}
}
